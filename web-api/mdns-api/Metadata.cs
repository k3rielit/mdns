namespace mdns_api.Models {
    public class Metadata {
        public readonly Dictionary<int, string> CarClassTemplates = new() {
            [0] = "C",
            [1] = "B & C",
            [2] = "B",
            [3] = "A & B",
            [4] = "A",
        };
        public readonly Dictionary<int, string> PublishTypes = new() {
            [0] = "Private",
            [1] = "Public",
            [2] = "SuperPublic",
        };
        public string Ip = "69.195.146.194";
        public Dictionary<string, string> Servers = new() {
            ["Madness"] = "multiplayer.needformadness.com",
            ["Dominion"] = "multiplayer.needformadness.com",
            ["Avenger"] = "avenger.needformadness.com",
            ["Ghostrider"] = "ghostrider.needformadness.com",
        };
        public Dictionary<string, int> Ports = new() {
            ["server"] = 7071,
            ["socket"] = 7061,
            ["game"] = 7001,
        };
        public readonly Dictionary<string,object> HttpGetRequests = new() {
            [""] = new {
                
            },
        };
        public readonly Dictionary<string,object> SocketServerMethods = new() {
            ["trial?"] = new {
                Url = "multiplayer.needformadness.com",
                Port = 7061,
                Out = new List<string>() {
                    "0|%username%|",
                },
                Source = "Login.java:435 [.run()]",
                Description = "Returns with 'code|freeplays|hours|nickey' where code is: -1: server unreachable, 0: success/name available, 1: name is in use, 2: successfully registered"
            },
            ["login"] = new {
                Url = "multiplayer.needformadness.com",
                Port = 7061,
                Out = new List<string>() {
                    "1|%username%|%password%|",
                },
                Source = "CarMaker.java:4314 [.ctachm()]",
                Description = "Tests username and password, and returns with: -1: server error, 1: bad username 2: bad password, -167: trial account, 0/3/111/10<: success (alongside 'code|nickey|clan|clankey|')"
            },
            ["removecar"] = new {
                Url = "multiplayer.needformadness.com",
                Port = 7061,
                Out = new List<string>() {
                    "9|%username%|%password%|%carname%|",
                },
                Source = "CarMaker.java:2837 [.run()]",
                Description = "Remove a car from an account. Returns with: 0: success, -1: server error, other: failed to remove"
            },
            ["publishcar"] = new {
                Url = "multiplayer.needformadness.com",
                Port = 7061,
                Out = new List<string>() {
                    "10|%username%|%password%|%carname%|%publishtype%|",
                    "%content%",
                    "QUITX1111",
                },
                Source = "CarMaker.java:4195 [.ctacham()]",
                Description = "Publish a car to an account. Overwrites the existing one if its yours. Pauses for 10ms before QUIT. Returns with: 0: success, 3: too long name, 4: name is already in use, 6: 3D model format error, 7: no 1st/2nd color, 8: no wheels, 9: empty code, 10: too many polygons, 11: too large car, 12: too small car, 13: incorrect stats & class, 14: incorrect physics, 15: handling not rated, other: unknown error"
            },
        };
    }
}
