namespace mdns_api.Models {
    public class Clan {
        public string Name { get; set; } = string.Empty;
        public string Logo { get; set; } = "https://dummyimage.com/350x30/aaa/ffffff.png&text=No+Logo";
        public string Background { get; set; } = "https://dummyimage.com/560x300/aaa/ffffff.jpg&text=No+Avatar";
        public List<ClanMember> Members { get; set; } = new();
        public List<string> Cars { get; set; } = new();
        public List<string> Stages { get; set; } = new();
        public Webpresence Webpresence { get; set; } = new();
    }
    public class ClanMember {
        public string Name { get; set; } = string.Empty;
        public byte Rank { get; set; } = 0;
        public string Description { get; set; } = string.Empty;
    }
    public class Webpresence {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }
}
