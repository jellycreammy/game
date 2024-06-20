using UnityEngine;
using ProtoBuf;
using System.IO;
using System.Buffers;

public class Packets : MonoBehaviour
{
    public enum PacketType { Ping, Normal, Location = 3 }

    public static void Serialize<T>(IBufferWriter<byte> writer, T data)
    {
        Serializer.Serialize(writer, data);
    }

  // ReadOnlySequence<byte>를 사용하는 역직렬화 함수
    public static T Deserialize<T>(ReadOnlySequence<byte> data)
    {
        return Serializer.Deserialize<T>(data);
    }
}

[ProtoContract]
public class InitialPayload
{
    [ProtoMember(1)]
    public string deviceId { get; set; }
}

[ProtoContract]
public class CommonPacket
{
    [ProtoMember(1)]
    public uint handlerId { get; set; }

    [ProtoMember(2)]
    public uint playerId { get; set; }

    [ProtoMember(3)]
    public string version { get; set; }

    [ProtoMember(4)]
    public byte[] payload { get; set; }
}