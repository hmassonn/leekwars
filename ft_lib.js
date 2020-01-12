//--------------------------------
//----------- library ------------
//--------------------------------

// WEAPON_PISTOL
// WEAPON_MACHINE_GUN
// WEAPON_SHOTGUN
// WEAPON_MAGNUM
// WEAPON_BROADSWORD
// WEAPON_LASER
// WEAPON_DOUBLE_GUN
// WEAPON_DESTROYER

global WEAPON_1 = WEAPON_LASER;
global WEAPON_2 = WEAPON_DESTROYER;

function heal_target(leek) {
	debug('heal_target');
	var fullLife = getTotalLife();
	var actualLife = getLife();

	if (actualLife < (fullLife - 342) and canUseChip(CHIP_VACCINE, leek)) {
		debug('CHIP_VACCINE');
		useChip(CHIP_VACCINE, leek);
	}
	if (actualLife < (fullLife - 129) and canUseChip(CHIP_CURE, leek)) {
		debug('CHIP_CURE');
		useChip(CHIP_CURE, leek);
	}
	if (actualLife < (fullLife - 45) and canUseChip(CHIP_BANDAGE, leek)) {
		debug('CHIP_BANDAGE');
		useChip(CHIP_BANDAGE, leek);
	}
}

function try_weapon(weapon, cell_me, enemy, @cell_list) {
	if (canUseWeapon(WEAPON_2, enemy)) {
		return true;
	}
	debug('try with close cells');
	for (var i = 0; i < count(cell_list); i++) {
		if (getPathLength(cell_me, cell_list[i]) < getMP()) {
			cell_list = [cell_list[i]];
			debug(cell_list);
			return true;
		}
	}
	return false;
}

function choose_weapon(enemy, cell_me, @cell_weapon_1, @cell_weapon_2) {
	debug('choose_weapon');
	var shield = getAbsoluteShield(enemy);
	//if (shield > 9) {
		//debug('lot shield');
		//return WEAPON_1;
	//}
	if (try_weapon(WEAPON_2, cell_me, enemy, cell_weapon_2)) {
		debug('i can use WEAPON_2');
		return WEAPON_2;
	}
	debug('i can not use WEAPON_2');
	if (try_weapon(WEAPON_1, cell_me, enemy, cell_weapon_1)) {
		debug('i can use WEAPON_1');
		return WEAPON_1;
	}
	debug('can not use WEAPON_1');
	return WEAPON_2;
}

function get_next_cell(cell) {
	var top = cell - 35;
	var top_right = cell - 17;
	var right = cell + 1;
	var bottom_right = cell + 18;
	var bottom = cell + 35;
	var bottom_left = cell + 17;
	var left = cell - 1;
	var top_left = cell - 18;
	var around_cells = [top, top_right, right, bottom_right, bottom, bottom_left, left, top_left];
	return around_cells;
}

function is_block(cell) {
	var around_cells = get_next_cell(cell);
	var nb = 0;
	for (var j = 0; j < count(around_cells); j++) {
		if (getCellContent(around_cells[j]) == CELL_EMPTY) nb++;
	}
	return nb;
}

function try_help(master, enemy) {
	var master_full_life = getTotalLife(master);
	var master_actual_life = getLife(master);
	
	if (canUseChip(CHIP_HELMET, master)) useChip(CHIP_HELMET, master);
	if (master_actual_life < master_full_life - 15) {
		if (canUseChip(CHIP_BANDAGE, master)) useChip(CHIP_BANDAGE, master);
	}
	if (canUseChip(CHIP_PROTEIN, master)) useChip(CHIP_PROTEIN, master);	
	if (canUseChip(CHIP_PEBBLE, enemy)) useChip(CHIP_PEBBLE, enemy);
}

function punyAI(){
	var master = getSummoner();
	var cell_master = getCell(master);
	var enemy = getNearestEnemy();
	var cell_enemy = getCell(enemy);
	var cell_me = getCell();

	
	try_help(master, enemy);
	if (is_block(master) and getPathLength(cell_master, cell_me) < 2) {
		moveAwayFrom(master);
	} else {
		moveToward(master);
	}
	try_help(master, enemy);
}