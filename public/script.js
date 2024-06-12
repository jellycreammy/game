document.addEventListener('DOMContentLoaded', () => {
    const dino = document.getElementById('dino');
    const obstacle = document.getElementById('obstacle');
    const scoreDisplay = document.getElementById('score');
    let isJumping = false;
    let gravity = 0.9;
    let isGameOver = false;
    let score = 0;

    function jump() {
        if (isJumping) return;
        let position = 0;
        isJumping = true;

        let upInterval = setInterval(() => {
            if (position >= 150) {
                clearInterval(upInterval);
                
                let downInterval = setInterval(() => {
                    if (position <= 0) {
                        clearInterval(downInterval);
                        isJumping = false;
                    }
                    position -= 5;
                    position = position * gravity;
                    dino.style.bottom = position + 'px';
                }, 20);
            }
            position += 30;
            position = position * gravity;
            dino.style.bottom = position + 'px';
        }, 20);
    }

    function generateObstacle() {
        let obstaclePosition = 800;
        let randomTime = Math.random() * 4000;
        obstacle.style.display = 'block';
        obstacle.style.left = `${obstaclePosition}px`;

        let obstacleInterval = setInterval(() => {
            if (obstaclePosition < -50) {
                clearInterval(obstacleInterval);
                obstacle.style.display = 'none';
                score += 10;
                scoreDisplay.innerText = `Score: ${score}`;
            }
            if (obstaclePosition > 0 && obstaclePosition < 50 && !isJumping) {
                clearInterval(obstacleInterval);
                isGameOver = true;
                document.body.innerHTML = '<h1 class="game-over">Game Over</h1>';
                sendScoreToServer(score);
            }
            obstaclePosition -= 10;
            obstacle.style.left = `${obstaclePosition}px`;
        }, 20);

        if (!isGameOver) {
            setTimeout(generateObstacle, randomTime);
        }
    }

    function sendScoreToServer(finalScore) {
        fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                handlerID: 2,  // 게임 종료 핸들러 ID
                payload: {
                    score: finalScore,
                }
            })
        }).then(response => {
            if (!response.ok) {
                console.error('Failed to send score to server');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    document.addEventListener('keyup', (e) => {
        if (e.keyCode === 32) {
            jump();
        }
    });

    generateObstacle();
});
