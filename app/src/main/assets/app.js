
let poseDetector;
let isRunning = false;
let animationFrame = null;

async function detectPose() {
    if (!isRunning || !poseDetector) return;
    
    try {
        const video = document.getElementById('webcam');
        const pose = await poseDetector.estimatePose(video);
        if (pose && pose.poseProbabilities) {
            document.getElementById('confidence1').textContent = Math.round(pose.poseProbabilities[0] * 100);
            document.getElementById('confidence2').textContent = Math.round(pose.poseProbabilities[1] * 100);
            document.getElementById('confidence3').textContent = Math.round(pose.poseProbabilities[2] * 100);
        }
    } catch (error) {
        console.error('Error during pose detection:', error);
    }
    
    animationFrame = requestAnimationFrame(detectPose);
}

document.getElementById('startBtn').addEventListener('click', async () => {
    if (isRunning) return;
    
    try {
        const video = document.getElementById('webcam');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });
        video.srcObject = stream;
        
        const modelURL = 'https://teachablemachine.withgoogle.com/models/gIF64n3nR/';
        poseDetector = await window.teachablemachine.pose.createTeachable(
            video,
            modelURL + 'model.json',
            modelURL + 'metadata.json'
        );
        
        document.getElementById('modelIndicator').textContent = 'Model Ready';
        document.getElementById('modelIndicator').style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
        isRunning = true;
        detectPose();
    } catch (error) {
        console.error('Failed to start:', error);
        document.getElementById('modelIndicator').textContent = 'Error: ' + error.message;
        document.getElementById('modelIndicator').style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    }
});

document.getElementById('stopBtn').addEventListener('click', () => {
    isRunning = false;
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    if (poseDetector) {
        poseDetector.dispose();
        poseDetector = null;
    }
    const video = document.getElementById('webcam');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    document.getElementById('modelIndicator').textContent = 'Stopped';
    document.getElementById('modelIndicator').style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
});
