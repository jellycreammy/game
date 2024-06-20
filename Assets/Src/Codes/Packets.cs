using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using UnityEngine;

public class Packets : MonoBehaviour
{
    public enum PacketType { Ping, Normal, Location = 3 }

// // Protobuf 직렬화 함수
//     public static byte[] Serialize<T>(T message) where T : IMessage
//     {
//         return message.ToByteArray();
//     }
    
//     // Protobuf 역직렬화 함수
//     public static T Deserialize<T>(byte[] data) where T : IMessage<T>, new()
//     {
//         T message = new T();
//         message.MergeFrom(data);
//         return message;
//     }

//     public static CommonPacket CreateCommonPacket(uint handlerId, uint playerId, string version, IMessage payload) {
//         return new CommonPacket
//         {
//             HandlerId = handlerId,
//             PlayerId = playerId,
//             Version = version,
//             Payload = ByteString.CopyFrom(Serialize(payload))
//         };
//     }
}