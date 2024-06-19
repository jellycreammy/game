using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public Transform[] spawnPoint;
    public SpawnData[] spawnData;

    void Awake() {
        spawnPoint = GetComponentsInChildren<Transform>();
    }

    // void Update()
    // {
    //     if (!GameManager.instance.isLive) {
    //         return;
    //     }
    //     Spawn();
    // }

    // void Spawn() {
    //     GameObject enemy = GameManager.instance.pool.Get(0);
    //     // enemy.transform.position = spawnPoint[Random.Range(1, spawnPoint.Length)].position;
    //     // enemy.GetComponent<Enemy>().Init(spawnData[level]);
    // }
}

[System.Serializable]
public class SpawnData {
    public float spawnTime;
    public int spriteType;
    public int health;
    public float speed;
}