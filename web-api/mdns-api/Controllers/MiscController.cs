using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using mdns_api.Models;

namespace mdns_api.Controllers {
    [Route("api/misc")]
    [ApiController]
    public class MiscController : ControllerBase {
        [HttpGet("top20")]
        public async Task<ActionResult<object>> GetTopTwentyObject() {
            object topTwenty = new {
                Date = DateTime.Now.ToString("yyyy.MM.dd"),
                Cars = new {
                    Weekly = new {
                        All = await Utils.GetTop20("cars","W","all"),
                        A = await Utils.GetTop20("cars","W","A"),
                        AB = await Utils.GetTop20("cars","W","AB"),
                        B = await Utils.GetTop20("cars","W","B"),
                        BC = await Utils.GetTop20("cars","W","BC"),
                        C = await Utils.GetTop20("cars","W","C"),
                    },
                    Monthly = new {
                        All = await Utils.GetTop20("cars","M","all"),
                        A = await Utils.GetTop20("cars","M","A"),
                        AB = await Utils.GetTop20("cars","M","AB"),
                        B = await Utils.GetTop20("cars","M","B"),
                        BC = await Utils.GetTop20("cars","M","BC"),
                        C = await Utils.GetTop20("cars","M","C"),
                    },
                    Semiannual = new {
                        All = await Utils.GetTop20("cars","S","all"),
                        A = await Utils.GetTop20("cars","S","A"),
                        AB = await Utils.GetTop20("cars","S","AB"),
                        B = await Utils.GetTop20("cars","S","B"),
                        BC = await Utils.GetTop20("cars","S","BC"),
                        C = await Utils.GetTop20("cars","S","C"),
                    },
                    Annual = new {
                        All = await Utils.GetTop20("cars","A","all"),
                        A = await Utils.GetTop20("cars","A","A"),
                        AB = await Utils.GetTop20("cars","A","AB"),
                        B = await Utils.GetTop20("cars","A","B"),
                        BC = await Utils.GetTop20("cars","A","BC"),
                        C = await Utils.GetTop20("cars","A","C"),
                    },
                    Alltime = new {
                        All = await Utils.GetTop20("cars","all"),
                        A = await Utils.GetTop20("cars","A"),
                        AB = await Utils.GetTop20("cars","AB"),
                        B = await Utils.GetTop20("cars","B"),
                        BC = await Utils.GetTop20("cars","BC"),
                        C = await Utils.GetTop20("cars","C"),
                    }
                },
                Stages = new {
                    Weekly = await Utils.GetTop20("tracks","W"),
                    Monthly = await Utils.GetTop20("tracks","M"),
                    Alltime = await Utils.GetTop20("tracks","A"),
                },
            };
            return Ok(topTwenty);
        }
    }
}
