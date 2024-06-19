using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

public class NetworkManager : MonoBehaviour
{
    public InputField ipInputField;
    public InputField portInputField;
    public GameObject uiNotice;
    private TcpClient tcpClient;
    private NetworkStream stream;

    WaitForSecondsRealtime wait;

    void Awake() {
        wait = new WaitForSecondsRealtime(5);
    }

    public void OnStartButtonClicked() {
        string ip = ipInputField.text;
        string port = portInputField.text;

        if (IsValidIP(ip) && IsValidPort(port)) {
            int portNumber = int.Parse(port);
            GameManager.instance.deviceId = GenerateUniqueID();
            
            if (ConnectToServer(ip, portNumber)) {
                StartGame();
                SendInitialPacket();
            } else {
                uiNotice.transform.GetChild(1).gameObject.SetActive(true);
                StartCoroutine(NoticeRoutine());
                AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
            }
            
        } else {
            uiNotice.transform.GetChild(0).gameObject.SetActive(true);
            StartCoroutine(NoticeRoutine());
            AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
        }
    }

    bool IsValidIP(string ip)
    {
        // 간단한 IP 유효성 검사
        return System.Net.IPAddress.TryParse(ip, out _);
    }

    bool IsValidPort(string port)
    {
        // 간단한 포트 유효성 검사 (0 - 65535)
        if (int.TryParse(port, out int portNumber))
        {
            return portNumber > 0 && portNumber <= 65535;
        }
        return false;
    }

     bool ConnectToServer(string ip, int port) {
        try {
            tcpClient = new TcpClient(ip, port);
            stream = tcpClient.GetStream();
            Debug.Log($"Connected to {ip}:{port}");

            return true;
        } catch (SocketException e) {
            Debug.LogError($"SocketException: {e}");
            return false;
        }
    }


    string GenerateUniqueID() {
        return System.Guid.NewGuid().ToString();
    }

    void StartGame()
    {
        // 게임 시작 코드 작성
        Debug.Log("Game Started");
        GameManager.instance.GameStart();
    }


    IEnumerator NoticeRoutine() {
        
        uiNotice.SetActive(true);

        yield return wait;

        uiNotice.SetActive(false);
    }

    public static byte[] ToBigEndian(byte[] bytes) {
        if (BitConverter.IsLittleEndian)
        {
            Array.Reverse(bytes);
        }
        return bytes;
    }

    byte[] CreatePacketHeader(int dataLength, Packets.PacketType packetType) {
        int packetLength = 4 + 1 + dataLength; // 전체 패킷 길이 (헤더 포함)
        byte[] header = new byte[5]; // 4바이트 길이 + 1바이트 타입

        // 첫 4바이트: 패킷 전체 길이
        byte[] lengthBytes = BitConverter.GetBytes(packetLength);
        lengthBytes = ToBigEndian(lengthBytes);
        Array.Copy(lengthBytes, 0, header, 0, 4);

        // 다음 1바이트: 패킷 타입
        header[4] = (byte)packetType;

        return header;
    }

    void SendInitialPacket() {
        // 패킷 데이터
        // InitialPacketPayload 생성
        InitialPacketPayload initialPayload = new InitialPacketPayload
        {
            deviceId = GameManager.instance.deviceId
        };

        byte[] data = Packets.SerializePacket(
            Packets.CreateCommonPacket(
                    1, 
                    null, 
                    GameManager.instance.version,
                    Packets.SerializePacket(initialPayload)
                )
            );

        // 헤더 생성
        byte[] header = CreatePacketHeader(data.Length, Packets.PacketType.Normal);

        // 패킷 생성
        byte[] packet = new byte[header.Length + data.Length];
        Array.Copy(header, 0, packet, 0, header.Length);
        Array.Copy(data, 0, packet, header.Length, data.Length);

        // 패킷 전송
        stream.Write(packet, 0, packet.Length);
        Debug.Log("Initial packet sent.");
    }

}