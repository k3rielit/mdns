namespace mdns_api.Models {
    public class Car {
        public string Name { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public byte PublishType { get; set; } = 0;
        public byte Class { get; set; } = 0;
        public string ClassName { get; set; } = "C";
        public int PolyCount { get; set; } = 0;
        public int VertexCount { get; set; } = 0;
        public bool ClanProperty { get; set; } = false;
        public string ClanName { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
        public List<string> AddedBy { get; set; } = new();
        public string Code { get; set; } = string.Empty;
    }
}
