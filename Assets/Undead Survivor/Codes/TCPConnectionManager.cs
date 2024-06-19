using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TCPConnectionManager : MonoBehaviour
{
    public InputField ipInputField;
    public InputField portInputField;
    public GameObject uiNotice;

    WaitForSecondsRealtime wait;

    void Awake() {
        wait = new WaitForSecondsRealtime(5);
    }

    public void OnStartButtonClicked()
    {
        string ip = ipInputField.text;
        string port = portInputField.text;

        if (IsValidIP(ip) && IsValidPort(port))
        {
            int portNumber = int.Parse(port);
            GameManager.instance.deviceId = GenerateUniqueID();
            ConnectToServer(ip, portNumber);
            StartGame();
        }
        else
        {
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

    void ConnectToServer(string ip, int port)
    {
        // TCP 연결 설정 코드 작성
        Debug.Log($"Connecting to {ip}:{port}");
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
}