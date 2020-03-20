let dropDiv, dropText;
let statTable;
let dragNum = -1;

window.onload = function() {
	dropDiv = document.querySelector("#dropDiv");
	dropText = document.querySelector(".dropInfo");
	statTable = document.querySelector(".enemy-table");
	
	statTable.style.display = 'none';
	
	dropDiv.ondrop = function(event) {
		dropHandler(event);
	};
};

function dragHandler(event, target) {
	dragNum = target;
}

function dropHandler(event) {
	if(dragNum === 0) {
		dropDiv.innerHTML = "<img alt='Barbarian' src='media/barb1.png'>";
		dropText.innerHTML = "Barbarian";
	}
	else if(dragNum === 1) {
		dropDiv.innerHTML = "<img alt='Barbarian' src='media/barb2.png'>";
		dropText.innerHTML = "Barbarian 2";
	}
	else if(dragNum === 2) {
		dropDiv.innerHTML = "<img alt='Barbarian' src='media/barb3.png'>";
		dropText.innerHTML = "Barbarian 3";
	}
	else if(dragNum === 3) {
		dropDiv.innerHTML = "<img alt='Barbarian' src='media/barb4.png'>";
		dropText.innerHTML = "Barbarian 4";
	}
	else if(dragNum === 4) {
		dropDiv.innerHTML = "<img alt='Barbarian' src='media/barb5.png'>";
		dropText.innerHTML = "Barbarian 5";
	}
	else if(dragNum === 5) {
		dropDiv.innerHTML = "<img alt='Archer' src='media/barb6.png'>";
		dropText.innerHTML = "Archer";
	}
	else if(dragNum === 6) {
		dropDiv.innerHTML = "<img alt='Barbarian' src='media/fastBarb.png'>";
		dropText.innerHTML = "Barbarian 6";
	}
	else if(dragNum === 7) {
		dropDiv.innerHTML = "<img alt='Archer' src='media/barb8.png'>";
		dropText.innerHTML = "Archer 2";
	}
	else if(dragNum === 8) {
		dropDiv.innerHTML = "<img alt='Skeleton' src='media/skeleton.png'>";
		dropText.innerHTML = "Skeleton";
	}
	else if(dragNum === 9) {
		dropDiv.innerHTML = "<img alt='Barbarian' src='media/redBarb.png'>";
		dropText.innerHTML = "Barbarian 7";
	}
	else if(dragNum === 10) {
		dropDiv.innerHTML = "<img alt='Archer' src='media/barb11.png'>";
		dropText.innerHTML = "Archer 3";
	}
	
	createStats();
	
	if(dragNum > -1) {
		dropText.classList.add("section-title");
	}
	dragNum = -1;
}

function createStats() {
	if(dragNum < 0) return;
	statTable.style.display = 'initial';
	
	let title = document.querySelector(".enemy-stat-title p");
	let attack = document.querySelector(".enemy-attack");
	let health = document.querySelector(".enemy-health");
	let speed = document.querySelector(".enemy-speed");
	let spawn = document.querySelector(".enemy-spawn");
	
	if(dragNum === 0) {
		title.innerHTML = 'Barbarian Stats';
		attack.innerHTML = 'None';
		health.innerHTML = '1';
		speed.innerHTML = '42';
		spawn.innerHTML = 'None';
	}
	else if(dragNum === 1) {
		title.innerHTML = 'Barbarian 2 Stats';
		attack.innerHTML = 'Melee';
		health.innerHTML = '5';
		speed.innerHTML = '30';
		spawn.innerHTML = 'None';
	}
	else if(dragNum === 2) {
		title.innerHTML = 'Barbarian 3 Stats';
		attack.innerHTML = 'Melee';
		health.innerHTML = '3';
		speed.innerHTML = '42';
		spawn.innerHTML = '<img alt="Barbarian" src="media/barb1.png">';
	}
	else if(dragNum === 3) {
		title.innerHTML = 'Barbarian 4 Stats';
		attack.innerHTML = 'Melee';
		health.innerHTML = '4';
		speed.innerHTML = '63';
		spawn.innerHTML = '<img alt="Barbarian" src="media/barb3.png">';
	}
	else if(dragNum === 4) {
		title.innerHTML = 'Barbarian 5 Stats';
		attack.innerHTML = 'Melee';
		health.innerHTML = '5';
		speed.innerHTML = '125';
		spawn.innerHTML = '<img alt="Barbarian" src="media/barb4.png">';
	}
	else if(dragNum === 5) {
		title.innerHTML = 'Archer Stats';
		attack.innerHTML = 'Arrow shot straight ahead';
		health.innerHTML = '6';
		speed.innerHTML = '125*';
		spawn.innerHTML = '<img alt="Barbarian" src="media/barb5.png">';
	}
	else if(dragNum === 6) {
		title.innerHTML = 'Barbarian 6 Stats';
		attack.innerHTML = 'None';
		health.innerHTML = '7';
		speed.innerHTML = '300*';
		spawn.innerHTML = '<img alt="Barbarian" src="media/barb5.png">';
	}
	else if(dragNum === 7) {
		title.innerHTML = 'Archer 2 Stats';
		attack.innerHTML = 'Arrows shot in all directions';
		health.innerHTML = '15';
		speed.innerHTML = '250*';
		spawn.innerHTML = '<img alt="Archer" src="media/barb6.png">';
	}
	else if(dragNum === 8) {
		title.innerHTML = 'Skeleton Stats';
		attack.innerHTML = 'None';
		health.innerHTML = '10';
		speed.innerHTML = '350';
		spawn.innerHTML = 'None';
	}
	else if(dragNum === 9) {
		title.innerHTML = 'Barbarian 7 Stats';
		attack.innerHTML = 'Melee';
		health.innerHTML = '20';
		speed.innerHTML = '300*';
		spawn.innerHTML = '<img alt="Barbarian" src="media/fastBarb.png">';
	}
	else if(dragNum === 10) {
		title.innerHTML = 'Archer 3 Stats';
		attack.innerHTML = 'Arrows shot in all directions';
		health.innerHTML = '25';
		speed.innerHTML = '300*';
		spawn.innerHTML = '<img alt="Archer" src="media/barb8.png">';
	}
}



