using ICSharpCode.SharpZipLib.Zip;
using System.Text;
using System;

namespace mdns_api {
    public class Utils {
        public async static Task<bool> RemoteFileExists(string url) {
            bool exists = false;
            try {
                HttpClient client = new();
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                exists = true;
            }
            catch(Exception) { }
            return exists;
        }

        public async static Task<string> GetText(string url, Encoding encoding) {
            string result = "";
            try {
                HttpClient client = new();
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                byte[] responseBody = await response.Content.ReadAsByteArrayAsync();
                result = encoding is null ? Encoding.Latin1.GetString(responseBody) : encoding.GetString(responseBody);
            }
            catch(Exception) { }
            return result;
        }

        public async static Task<byte[]> GetByteArray(string url) {
            byte[] result = Array.Empty<byte>();
            try {
                HttpClient client = new();
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                result = await response.Content.ReadAsByteArrayAsync();
            }
            catch(Exception) { }
            return result;
        }

        public async static Task<byte[]> ExtractRadq(byte[] raw) {
            if(raw.Length>0) {
                ZipInputStream zipInputStream;
                if(raw[0] == 80 && raw[1] == 75 && raw[2] == 3) {
                    zipInputStream = new ZipInputStream(new MemoryStream(raw));
                }
                else {
                    byte[] buf = new byte[raw.Length - 40];
                    for(int i = 0; i < raw.Length - 40; ++i) {
                        buf[i] = raw[i + (i >= 500 ? 40 : 20)];
                    }
                    zipInputStream = new ZipInputStream(new MemoryStream(buf));
                }
                try {
                    ZipEntry nextEntry = zipInputStream.GetNextEntry();
                    if(nextEntry != null) {
                        byte[] result_byte = new byte[int.Parse(nextEntry.Name)];
                        await zipInputStream.ReadAsync(result_byte);
                        zipInputStream.Close();
                        return result_byte;
                    }
                }
                catch(Exception ex) {
                    Console.WriteLine(ex);
                }
            }
            return Array.Empty<byte>();
        }

        public async static Task<byte[]> GetPublishedCodeByteArray(string category, string name) {
            byte[] result = Array.Empty<byte>();
            try {
                HttpClient client = new();
                HttpResponseMessage response = await client.GetAsync($"http://multiplayer.needformadness.com/{category}/{name.Replace(' ','_').Replace("%20","_")}.radq");
                response.EnsureSuccessStatusCode();
                byte[] raw = await response.Content.ReadAsByteArrayAsync();
                return await ExtractRadq(raw);
            }
            catch(Exception) { }
            return result;
        }

        public async static Task<string> GetPublishedCode(string category, string name) {
            return Encoding.Latin1.GetString(await GetPublishedCodeByteArray(category, name));
        }

        public async static Task<Dictionary<string,int>> GetTop20(string category, string timeframe, string carClass = "") {
            Dictionary<string,int> result = new();
            try {
                HttpClient client = new();
                HttpResponseMessage response = await client.GetAsync($"http://multiplayer.needformadness.com/{category}/top20/{timeframe}{carClass}.txt");
                response.EnsureSuccessStatusCode();
                byte[] responseBody = await response.Content.ReadAsByteArrayAsync();
                string data = Encoding.Latin1.GetString(responseBody);
                if(data.Contains(')')) {
                    string[] keys = data.Split('(',')')[1].Split(',');
                    string[] values = data.Split('(',')')[3].Split(',');
                    for(int i = 0; i < keys.Length && i < values.Length; i++) {
                        result.TryAdd(keys[i], Convert.ToInt32(values[i]));
                    }
                }
            }
            catch(Exception) { }
            return result;
        }
    }
}