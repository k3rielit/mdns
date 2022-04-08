using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using mdns_api.Models;

namespace mdns_api.Controllers {
    [Route("api/clans")]
    [ApiController]
    public class ClanController : ControllerBase {
        [HttpGet("get/{name}")]
        public async Task<ActionResult<Clan>> GetByName(string name) {
            Clan clan = new() {
                Name = System.Web.HttpUtility.UrlDecode(name),
            };
            name = name.Replace(' ', '_').Replace("%20", "_");
            // member list
            string memberlist = await Utils.GetText($"http://multiplayer.needformadness.com/clans/{name}/members.txt", Encoding.Latin1);
            foreach(string memberRow in memberlist.Replace("\r", "").Split('\n')) {
                string[] splitMemberRow = memberRow.Split('|');
                if(splitMemberRow.Length >= 3) {
                    _ = byte.TryParse(splitMemberRow[1], out byte rank);
                    clan.Members.Add(new ClanMember {
                        Name = splitMemberRow[0],
                        Rank = rank,
                        Description = splitMemberRow[2],
                    });
                }
            }
            if(clan.Members.Count == 0) {
                return NotFound();
            }
            // logo, background check
            string logoUrl = $"http://multiplayer.needformadness.com/clans/{name}/logo.png";
            string bgUrl = $"http://multiplayer.needformadness.com/clans/{name}/bg.jpg";
            clan.Logo = await Utils.RemoteFileExists(logoUrl) ? logoUrl : "";
            clan.Background = await Utils.RemoteFileExists(bgUrl) ? bgUrl : "";
            // cars
            clan.Cars = (await Utils.GetText($"http://multiplayer.needformadness.com/clans/{name}/cars.txt", Encoding.Latin1)).Replace("\r","").Split('\n').Where(w => w.Length>0).ToList();
            // stages
            clan.Stages = (await Utils.GetText($"http://multiplayer.needformadness.com/clans/{name}/stages.txt", Encoding.Latin1)).Replace("\r","").Split('\n').Where(w => w.Length>0).ToList();
            // web presence
            string[] webpresence = (await Utils.GetText($"http://multiplayer.needformadness.com/clans/{name}/link.txt", Encoding.Latin1)).Replace("\r","").Split('\n');
            if(webpresence.Length >= 3) {
                clan.Webpresence.Title = webpresence[0];
                clan.Webpresence.Description = webpresence[1];
                clan.Webpresence.Url = webpresence[2];
            }
            // return the final clan object
            return Ok(clan);
        }
    }
}
