
let player;
let simulationText;

const simulateYear = () => {
    console.log("Simulating Year");
    player.age += 1;

    simulationText = 'A year passes.'
    updatePageRender();
}

const initialSetup = () => {
    console.log("Initial Setup");
    
    player = {
        fullName: 'John Smith',
        age: 0
    };
    simulationText = 'You are born into a new world.';

    updatePageRender();
}

const updatePageRender = () => {
    document.getElementById('simulationText').innerHTML = `${simulationText}`
    document.getElementById('playerName').innerHTML = `Your Name: ${player.fullName}`;
    document.getElementById('playerAge').innerHTML = `Your Age: ${player.age}`;
}