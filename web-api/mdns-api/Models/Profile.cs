

namespace mdns_api.Models {
    public class Profile {
        public string Name { get; set; } = string.Empty;
        public string Logo { get; set; } = "https://dummyimage.com/120x30/aaa/ffffff.png&text=No+Logo";
        public string Avatar { get; set; } = "https://dummyimage.com/200x200/aaa/ffffff.png&text=No+Avatar";
        public string ThemeSong { get; set; } = string.Empty;
        public string ThemeSongName { get; set; } = string.Empty;
        public int TrackVol { get; set; } = 0;
        public int Racing { get; set; } = 0;
        public int Wasting { get; set; } = 0;
        public string ClanName { get; set; } = string.Empty;
        public string ClanLogo { get; set; } = "https://dummyimage.com/350x30/aaa/ffffff.png&text=No+Clan+Logo";
        public string Description { get; set; } = string.Empty;
        public List<string> Cars { get; set; } = new();
        public List<string> Stages { get; set; } = new();
        public List<string> Friends { get; set; } = new();
    }
}
