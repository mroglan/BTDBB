let dropDiv, dropText;
let baseTable;
let upgradeTable, note;
let dragNum = -1;

window.onload = function() {
	dropDiv = document.querySelector("#dropDiv");
	dropText = document.querySelector(".dropInfo");
	baseTable = document.querySelector("#soldier-table");
	upgradeTable = document.querySelector("#up-table");
	note = document.querySelector(".note");
	
	baseTable.style.display = 'none';
	upgradeTable.style.display = 'none';
	note.style.display = 'none';
	
	dropDiv.ondrop = function(event) {
		dropHandler(event);
	};
};

function dragHandler(event, target) {
	dragNum = target;
}

function dropHandler(event) {
	if(dragNum === 0) {
		dropDiv.innerHTML = "<img alt='Soldier' src='media/soldier.png'>";
		dropText.innerHTML = "Soldier";
	}
	else if(dragNum === 1) {
		dropDiv.innerHTML = "<img alt='Archer' src='media/archer.png'>";
		dropText.innerHTML = "Archer";
	}
	else if(dragNum === 2) {
		dropDiv.innerHTML = "<img alt='Cavalry' src='media/calvary.png'>";
		dropText.innerHTML = "Cavalry";
	}
	else if(dragNum === 3) {
		dropDiv.innerHTML = "<img alt='Cannon' src='media/cannon.png'>";
		dropText.innerHTML = "Cannon";
	}
	else if(dragNum === 4) {
		dropDiv.innerHTML = "<img alt='Ship' src='media/ship.png'>";
		dropText.innerHTML = "Ship";
	}
	else if(dragNum === 5) {
		dropDiv.innerHTML = "<img alt='Sharpshooter' src='media/sniper.png'>";
		dropText.innerHTML = "Sharpshooter";
	}
	else if(dragNum === 6) {
		dropDiv.innerHTML = "<img alt='General' src='media/general.png'>";
		dropText.innerHTML = "General";
	}
	else if(dragNum === 7) {
		dropDiv.innerHTML = "<img alt='Medic' src='media/medic.png'>";
		dropText.innerHTML = "Medic";
	}
	else if(dragNum === 8) {
		dropDiv.innerHTML = "<img alt='Rifleman' src='media/rifleman.png'>";
		dropText.innerHTML = "Rifleman";
	}
	else if(dragNum === 9) {
		dropDiv.innerHTML = "<img alt='Wizard' src='media/wizard.png'>";
		dropText.innerHTML = "Wizard";
	}
	
	createBaseStats();
	createUpgradeStats();
	
	if(dragNum > -1) {
		dropText.classList.add("section-title");
	}
	dragNum = -1;
}

function createBaseStats() {
	if(dragNum < 0) return;
	baseTable.style.display = 'initial';
	
	let title = document.querySelector(".base-stat-title p");
	let melee = document.querySelector(".base-melee");
	let range = document.querySelector(".base-range");
	let health = document.querySelector(".base-health");
	let damage = document.querySelector(".base-damage");
	let speed = document.querySelector(".base-speed");
	let stealth = document.querySelector(".base-stealth");
	
	if(dragNum === 0) {
		title.innerHTML = "Soldier Base Stats";
		melee.innerHTML = 'Melee';
		range.innerHTML = '5';
		health.innerHTML = '200';
		damage.innerHTML = '1';
		speed.innerHTML = '0.5';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 1) {
		title.innerHTML = "Archer Base Stats";
		melee.innerHTML = 'Arrow';
		range.innerHTML = '10';
		health.innerHTML = '50';
		damage.innerHTML = '1';
		speed.innerHTML = '0.4';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 2) {
		title.innerHTML = "Cavalry Base Stats";
		melee.innerHTML = 'Melee';
		range.innerHTML = '10';
		health.innerHTML = '300';
		damage.innerHTML = '2';
		speed.innerHTML = '0.4';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 3) {
		title.innerHTML = "Cannon Base Stats";
		melee.innerHTML = 'Cannonball';
		range.innerHTML = '7';
		health.innerHTML = '250';
		damage.innerHTML = '2';
		speed.innerHTML = '0.3';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 4) {
		title.innerHTML = "Ship Base Stats";
		melee.innerHTML = 'Arrow';
		range.innerHTML = '10';
		health.innerHTML = '400';
		damage.innerHTML = '1';
		speed.innerHTML = '0.6';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 5) {
		title.innerHTML = "Sharpshooter Base Stats";
		melee.innerHTML = 'Arrow';
		range.innerHTML = '20';
		health.innerHTML = '50';
		damage.innerHTML = '5';
		speed.innerHTML = '0.4';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 6) {
		title.innerHTML = "General Base Stats";
		melee.innerHTML = 'Leadership';
		range.innerHTML = '5';
		health.innerHTML = '150';
		damage.innerHTML = 'N/A';
		speed.innerHTML = 'N/A';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 7) {
		title.innerHTML = "Medic Base Stats";
		melee.innerHTML = 'Healing';
		range.innerHTML = '5';
		health.innerHTML = '50';
		damage.innerHTML = '1 hp increase';
		speed.innerHTML = '0.12';
		stealth.innerHTML = 'N/A';
	}
	else if(dragNum === 8) {
		title.innerHTML = "Rifleman Base Stats";
		melee.innerHTML = 'Bullet';
		range.innerHTML = '13';
		health.innerHTML = '150';
		damage.innerHTML = '2';
		speed.innerHTML = '1.2';
		stealth.innerHTML = 'No';
	}
	else if(dragNum === 9) {
		title.innerHTML = "Wizard Base Stats";
		melee.innerHTML = 'Fire Ball';
		range.innerHTML = '10';
		health.innerHTML = '200';
		damage.innerHTML = '5';
		speed.innerHTML = '1.2';
		stealth.innerHTML = 'No';
	}
}

function createUpgradeStats() {
	if(dragNum < 0) return;
	upgradeTable.style.display = 'initial';
	note.style.display = 'initial';
	
	let title = document.querySelector(".upgrade-stat-title p");
	let a2 = document.querySelector(".u-2-a");
	let a3 = document.querySelector(".u-3-a");
	let a4 = document.querySelector(".u-4-a");
	let a5 = document.querySelector(".u-5-a");
	let b2 = document.querySelector(".u-2-b");
	let b3 = document.querySelector(".u-3-b");
	let b4 = document.querySelector(".u-4-b");
	let b5 = document.querySelector(".u-5-b");
	
	if(dragNum === 0) {
		title.innerHTML = 'Soldier Upgrades';
		a2.innerHTML = 'Range upgraded to 6.5';
		a3.innerHTML = 'Range upgraded to 8.45';
		a4.innerHTML = 'Stealth Detection';
		a5.innerHTML = 'No upgrade available';
		b2.innerHTML = 'Speed upgraded to 0.67 attacks per second';
		b3.innerHTML = 'Damage upgraded to 2';
		b4.innerHTML = 'Speed upgraded to 2 attacks per second';
		b5.innerHTML = 'Damage upgraded to 5';
	}
	else if(dragNum === 1) {
		title.innerHTML = 'Archer Upgrades';
		a2.innerHTML = 'Range upgraded to 13';
		a3.innerHTML = 'Range upgraded to 16.9';
		a4.innerHTML = 'Stealth Detection';
		a5.innerHTML = 'Triple Shot';
		b2.innerHTML = 'Speed upgraded to 0.6 attacks per second';
		b3.innerHTML = 'Piercing Arrows';
		b4.innerHTML = 'Damage upgraded to 3';
		b5.innerHTML = 'Speed upgraded to 2 attacks per second';
	}
	else if(dragNum === 2) {
		title.innerHTML = 'Cavalry Upgrades';
		a2.innerHTML = 'Range upgraded to 13';
		a3.innerHTML = 'Splash Damage';
		a4.innerHTML = 'Stuns hit enemies for 1 second';
		a5.innerHTML = 'Stuns hit enemies for 2 seconds';
		b2.innerHTML = 'Damage upgraded to 4';
		b3.innerHTML = 'Damage upgraded to 6';
		b4.innerHTML = 'Speed upgraded to 0.6 attacks per second';
		b5.innerHTML = 'Speed upgraded to 1.2 attacks per second';
	}
	else if(dragNum === 3) {
		title.innerHTML = 'Cannon Upgrades';
		a2.innerHTML = 'Range upgraded to 9.8';
		a3.innerHTML = 'Range upgraded to 14.7';
		a4.innerHTML = 'Explosion radius upgraded to 3';
		a5.innerHTML = 'Explosion radius upgraded to 4.5';
		b2.innerHTML = 'Damage upgraded to 5';
		b3.innerHTML = 'Speed upgraded to 0.6 attacks per second';
		b4.innerHTML = 'Double Shot';
		b5.innerHTML = 'Triple Shot';
	}
	else if(dragNum === 4) {
		title.innerHTML = 'Ship Upgrades';
		a2.innerHTML = 'Range upgraded to 14';
		a3.innerHTML = 'Range upgraded to 19.6';
		a4.innerHTML = 'Speed upgraded to 2 attacks per second';
		a5.innerHTML = 'Speed upgraded to 12 attacks per second';
		b2.innerHTML = 'Stealth Detection';
		b3.innerHTML = 'Piercing Arrows';
		b4.innerHTML = 'Shot type changed to cannonball and damage upgraded to 2';
		b5.innerHTML = 'Explosion radius upgraded to 5';
	}
	else if(dragNum === 5) {
		title.innerHTML = 'Sharpshooter Upgrades';
		a2.innerHTML = 'Range upgraded to 26';
		a3.innerHTML = 'Range upgraded to 33.8';
		a4.innerHTML = 'Stealth Detection';
		a5.innerHTML = 'Flaming Arrows';
		b2.innerHTML = 'Speed upgraded to 0.8 attacks per second';
		b3.innerHTML = 'Speed upgraded to 2.4 attacks per second';
		b4.innerHTML = 'Damage upgraded to 8';
		b5.innerHTML = 'Double Shot';
	}
	else if(dragNum === 6) {
		title.innerHTML = 'General Upgrades';
		a2.innerHTML = 'Range upgraded to 6.5';
		a3.innerHTML = 'Range upgraded to 9.1';
		a4.innerHTML = 'All soldiers in range upgraded to level 5 in both paths';
		a5.innerHTML = 'No upgrade available';
		b2.innerHTML = 'Stealth Detection for troop(s)';
		b3.innerHTML = 'Troop(s) speed increased';
		b4.innerHTML = 'Troop(s) speed increased'
		b5.innerHTML = 'No upgrade available';
	}
	else if(dragNum === 7) {
		title.innerHTML = 'Medic Upgrades';
		a2.innerHTML = 'Range upgraded to 7.5';
		a3.innerHTML = 'Range upgraded to 9.75';
		a4.innerHTML = 'No upgrade available';
		a5.innerHTML = 'No upgrade available';
		b2.innerHTML = 'Speed upgraded to 0.15 health increase per second';
		b3.innerHTML = 'Speed upgraded to 0.24 health increase per second';
		b4.innerHTML = 'No upgrade available';
		b5.innerHTML = 'No upgrade available';
	}
	else if(dragNum === 8) {
		title.innerHTML = 'Rifleman Upgrades';
		a2.innerHTML = 'Range upgraded to 16.9';
		a3.innerHTML = 'Range upgraded to 20.28';
		a4.innerHTML = 'Speed upgraded to 2 attacks per second';
		a5.innerHTML = 'Speed upgraded to 30 attacks per second';
		b2.innerHTML = 'Damage upgraded to 4';
		b3.innerHTML = 'Piercing Bullets';
		b4.innerHTML = 'Damage upgraded to 6';
		b5.innerHTML = 'Slow down hit enemies';
	}
	else if(dragNum === 9) {
		title.innerHTML = 'Wizard Upgrades';
		a2.innerHTML = 'Range upgraded to 13';
		a3.innerHTML = 'Range upgraded to 16.9';
		a4.innerHTML = 'Stun hit enemies';
		a5.innerHTML = 'Teleport hit enemies';
		b2.innerHTML = 'Speed upgraded to 2 attacks per second';
		b3.innerHTML = 'Damage upgraded to 8';
		b4.innerHTML = 'Speed upgraded to 30 attacks per second';
		b5.innerHTML = 'Triple Shot';
	}
}








