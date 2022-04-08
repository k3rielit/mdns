namespace mdns_api.Models {
    public class Stage {
        public string Name { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public string Soundtrack { get; set; } = string.Empty;
        public string SoundtrackUrl { get; set; } = string.Empty;
        public int SoundtrackVolume { get; set; } = 0;
        public int SoundtrackSize { get; set; } = 0;
        public byte PublishType { get; set; } = 0;
        public bool ClanProperty { get; set; } = false;
        public string ClanName { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
        public List<string> AddedBy { get; set; } = new();
        public string Code { get; set; } = string.Empty;
    }
}
