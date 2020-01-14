//--------------------------------
//------- Code de base -----------
//--------------------------------

include('ft_lib');
global map = [34];

function get_path(target, dist_max) {
	var list_cell = [];
	for (var i = 0; i < 613; i++) {
		if (getPathLength(target, i) <= dist_max) {
			push(list_cell, i);
		}
	}
	return list_cell;
}

function shoot_if(weapon, enemy) {
	if (canUseWeapon(enemy)) {
		debug('i can shoot');
		while (getTP() >= getWeaponCost(weapon)) {
			useWeapon(enemy);
		}
		return true;
	}
	debug('i can not shoot');
	return false;
}

/*
function choose_weapon(enemy, cell_me, cell_pistol, @cell_machine_gun) {
	debug('choose_weapon');
	var shield = getAbsoluteShield(enemy);
	//if (shield > 9) {
		//debug('lot shield');
		//return WEAPON_1;
	//}
	if (canUseWeapon(WEAPON_2, enemy)) {
		debug('i can use machine gun');
		return WEAPON_2;
	}
	for (var i = 0; i < count(cell_machine_gun); i++) {
		if (getPathLength(cell_me, cell_machine_gun[i]) < getMP()) {
			cell_machine_gun = [cell_machine_gun[i]];
			debug('using machine gun not so far');
			return WEAPON_2;
		}
	}
	debug('i can not use WEAPON_2');
	if (canUseWeapon(WEAPON_1, enemy)) {
		debug('i can use pistol');
		return WEAPON_1;
	}
	for (var i = 0; i < count(cell_pistol); i++) {
		if (getPathLength(cell_me, cell_pistol[i]) < getMP()) {
			cell_pistol = [cell_pistol[i]];
			debug('using pistol not so far');
			return WEAPON_1;
		}
	}
	debug('can not use WEAPON_1');
	return WEAPON_2;
}
*/
function getNearestObstacle(cell_target) {
	debug('getNearestObstacle');
	var obstacles = getObstacles();
	var min = 34;
	for (var i = 0; i < count(obstacles); i++) {
		var new_min = getCellDistance(cell_target, obstacles[i]);
		if (new_min < min) min = new_min; 
	}
	for (var i = 0; i < count(obstacles); i++) {
		var new_min = getCellDistance(cell_target, obstacles[i]);
		if (new_min == min) return obstacles[i]; 
	}
}

function cartographe() {
	for (var c = 0; c < 612; c++) {
		var x = getCellX(c);
		var y = getCellY(c);
		x = x + 17;
		y = y + 17;
		map[x][y] = c;
	}
}

function get_no_sight_around(near_obstacle, enemy_cell, me, enemy) {
	debug('get_no_sight_around');
	var around_cells = get_next_cell(near_obstacle);
	
	var enemy_cell_move = get_path(enemy_cell, getTotalMP(enemy));
	for (var j = 0; j < count(around_cells); j++) {
		var total = 0;
		for (var i = 0; i < count(enemy_cell_move); i++) {
			if (lineOfSight(around_cells[j], enemy_cell_move[i], me)) {
				total++;
			}
		}
		if (total == 0) {
			return around_cells[j];
		}
	}
	return false;
}

function main(main_turn) {

	var antibug_of_leekwar = 10;
	var second_antibug_of_leekwar = 10;
	var turn = getTurn(); // max 64
	if (turn < 2) {
		say("C'est qui le taulier ?!");

		// on initialise la map vide
		for (var i = 0; i < 34; i++) {
			var tab = [34];
			map[i] = tab;
		}
		// on recupere les x y des cases
		cartographe();
		// for (var i = 0; i < 34; i++) {
		//	debug(map[i]);
		// }
	}
	
	var enemy = getNearestEnemy();
	var cell_enemy = getCell(enemy);
	var me = getLeek();
	var cell_me = getCell();
	var cell_pistol = getCellsToUseWeapon(WEAPON_1, enemy);
	var cell_machine_gun = getCellsToUseWeapon(WEAPON_2, enemy);
	var near_obstacle = getNearestObstacle(cell_me);
	var fullLife = getTotalLife();
	var actualLife = getLife();
	var cells_buble = get_next_cell(cell_me);

	var weapon = choose_weapon(enemy, cell_me, cell_pistol, cell_machine_gun);
	//var weapon = WEAPON_PISTOL;
	if (getWeapon() != weapon) {
		if (weapon == WEAPON_2) {
			debug('take WEAPON_2');
		} else {
			debug('take WEAPON_1');	
		}
		setWeapon(weapon);
	}
	
	if (canUseChip(CHIP_ARMORING, me)) useChip(CHIP_ARMORING, me);

	for (var i = 0; i < count(cells_buble); i++) {
		if (canUseChipOnCell(CHIP_PUNY_BULB, cells_buble[i])) {
			summon(CHIP_PUNY_BULB, cells_buble[i], punyAI);
		}
	}

	var fire_distance = getTotalMP() + getTotalMP(enemy) + 10;
	if (getCellDistance(cell_me, cell_enemy) < fire_distance) {
		if (canUseChip(CHIP_SHIELD, me)) useChip(CHIP_SHIELD, me);
		if (canUseChip(CHIP_HELMET, me)) useChip(CHIP_HELMET, me);
		if (canUseChip(CHIP_WALL, me)) useChip(CHIP_WALL, me);
	}
	
	if (canUseChip(CHIP_STALACTITE, enemy)) useChip(CHIP_STALACTITE, enemy);
	if (canUseChip(CHIP_ROCKFALL, enemy)) useChip(CHIP_ROCKFALL, enemy);

	while (getMP() >= 1) {
		if (shoot_if(weapon, enemy)) {
			break;
		} else {
			var cells_shoot = weapon == WEAPON_1 ? cell_pistol : cell_machine_gun;
			debug('move to cell for shoot, MP = ');
			debug(getMP());
			antibug_of_leekwar--;
			if (antibug_of_leekwar < 1) {
				second_antibug_of_leekwar--;
				if (second_antibug_of_leekwar < 1) {
					break;
				}
				debug('function towardCell bug so we go on enemy');
				moveToward(enemy, 1);
			} else {
				debug(cells_shoot);
				moveTowardCell(cells_shoot[0], 1);
			}
		}
	}

	shoot_if(weapon, enemy);
	heal_target(me);
	if (canUseChip(CHIP_SPARK, enemy)) {
		debug('i can use CHIP_SPARK');
		while (getTP() >= 2) {
			useChip(CHIP_SPARK, enemy);
		}
	}
	if (getCellDistance(cell_me, cell_enemy) > (10 + getTotalMP(enemy)) and actualLife < 100) {
		moveAwayFrom(enemy);
	} else {
		var cell_hide = get_no_sight_around(near_obstacle, cell_enemy, me, enemy);
		debug(cell_hide);
		if (cell_hide) {
			moveTowardCell(cell_hide);	
		} else {
			moveAwayFrom(enemy);
		}
	}
	if (main_turn > 0) {
		main(main_turn - 1);
	}
}

main(1);
