using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;
using mdns_api.Models;

namespace mdns_api.Controllers {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
    [Route("api/cars")]
    [ApiController]
    public class CarController : ControllerBase {

        private static readonly Random r = new();
        public static readonly SortedDictionary<string,Car> cars = new();

        [HttpGet]
        public async Task<ActionResult<List<Car>>> GetAll() {
            return Ok(cars);
        }

        [HttpGet("names")]
        public async Task<ActionResult<List<string>>> GetNames() {
            return Ok(cars.Keys);
        }

        [HttpGet("random")]
        public async Task<ActionResult<Car>> GetRandom() {
            return Ok(cars.ElementAt(r.Next(0, cars.Count)));
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetCount() {
            return Ok(cars.Count);
        }

        [HttpGet("get/{name}")]
        public async Task<ActionResult<Car>> GetByName(string name) {
            if(!cars.ContainsKey(name)) {
                HttpClient client = new();
                Car car = new() {
                    Name = System.Web.HttpUtility.UrlDecode(name),
                };
                // code
                string code = await Utils.GetPublishedCode("cars",name);
                if(code.Length > 0) {
                    car.Code = code;
                    foreach(string line in code.Split('\n')) car.PolyCount += line.Trim().StartsWith("<p>") ? 1 : 0;
                }
                else return NotFound();
                // other properties
                string detailsraw = await Utils.GetText($"http://multiplayer.needformadness.com/cars/{name}.txt", Encoding.Latin1);
                if(detailsraw.Contains("details(")) {
                    car.Code += '\n'+detailsraw;
                    string[] details = detailsraw.Split('(', ')')[1].Split(',');
                    car.Publisher = details[0];
                    car.PublishType = Convert.ToByte(details[1]);
                    car.Class = Convert.ToByte(details[2]);
                    car.AddedBy = details.Skip(3).ToList();
                    if(detailsraw.Contains("Clan#")) {
                        car.ClanProperty = true;
                        car.ClanName = car.AddedBy.FirstOrDefault(f => f.StartsWith("Clan#"), "#").Split('#')[1];
                    }
                }
                // return and cache the car
                cars.Add(name,car);
                return Ok(car);
            }
            return Ok(cars[name]);
        }

        [HttpGet("asfile/{name}.{extension}")]
        public async Task<ActionResult<string>> GetAsFile(string name, string extension = "rad") {
            byte[] code = await Utils.GetPublishedCodeByteArray("cars",name);
            if(code.Length > 0) {
                byte[] data = await Utils.GetByteArray($"http://multiplayer.needformadness.com/cars/{name}.txt");
                byte[] result = new byte[code.Length + data.Length];
                Buffer.BlockCopy(code,0,result,0,code.Length);
                Buffer.BlockCopy(data,0,result,code.Length,data.Length);
                return File(result,"text/plain",$"{name}.{extension}");
            }
            else return NotFound();
        }
    }
}