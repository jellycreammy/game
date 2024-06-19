using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using UnityEngine;

public class Packets : MonoBehaviour
{
    public enum PacketType { Ping, Normal, Location = 3 }

    // 제네릭 직렬화 함수
    public static byte[] SerializePacket<T>(T packet)
    {
        if (packet == null)
            return null;

        BinaryFormatter bf = new BinaryFormatter();
        using (MemoryStream ms = new MemoryStream())
        {
            bf.Serialize(ms, packet);
            return ms.ToArray();
        }
    }

    // 제네릭 역직렬화 함수
    public static T DeserializePacket<T>(byte[] data)
    {
        if (data == null || data.Length == 0)
            return default(T);

        BinaryFormatter bf = new BinaryFormatter();
        using (MemoryStream ms = new MemoryStream(data))
        {
            return (T)bf.Deserialize(ms);
        }
    }

    public static CommonPacket CreateCommonPacket<T>(int handleId, string userId, string version, T payload) {
        return new CommonPacket
        {
            handleId = handleId,
            userId = userId,
            version = version,
            payload = SerializePacket(payload)
        };
    }

}

[System.Serializable]
public class CommonPacket
{
    public int handleId;
    public string userId;
    public string version;
    public byte[] payload;
}

[System.Serializable]
public class InitialPacketPayload
{
    public string deviceId;
}

