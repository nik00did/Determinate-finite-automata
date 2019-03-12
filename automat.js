const fs = require('fs');
const rl = require('readline-sync');
function FDA_EMUL(){
	let object = {};
	// Запись в файл JSON типа
	object.toJSON = function(path,name=''){
		let save_text_json=JSON.stringify({"matr":this.matr,"finish_states":this.finish_states,"begin_state":this.begin_state},undefined," ");
		fs.writeFileSync(path+name,save_text_json);
	}
	// Чтение из файла JSON типа
	object.fromJSON = function(path,name){
		let json_file = JSON.parse(fs.readFileSync(path,'utf8'));
		this.matr = json_file['matr'];
		this.finish_states = json_file['finish_states'];
		this.begin_state = json_file['begin_state'];
		for( var x in this.matr){
			for(var y in this.matr[x]){
				if (this.alphabet.indexOf(y)==-1) this.alphabet+=y;
			}
			this.amount+=1;
		}
	}
	object.run = function(string,mode=false){
		let steps = string.length;
		let currState=this.begin_state;
		for(let i=0;i<steps;i++){
			if(mode==true){
				console.log('Step #'+(+i+1)+ "Str - "+string[i]+" Current State: " +currState+'\n');
			}
			if(this.alphabet.indexOf(string[i])==-1){
				if(mode==true) console.log('Перечень букв данной строки не является подмножеством алфавита');
				return false;
			}
			if(currState == 'ERR'){ 
				if(mode == true) console.log('Текущее состояние в режиме ошибки');
				return false;
			}
			currState=this.matr[currState][string[i]];
		}
		console.log(currState);
		if(this.finish_states.indexOf(currState)!=-1) return true;
		else {
			if(mode==true) console.log('Текущее состояние не является финальным');
			return false;
		}
	}
	object.matr = new Object();
	object.alphabet = new String();
	object.amount = 0;
	object.finish_states = new Array();
	object.begin_state = new String();
	return object;
}
console.log('Emulator FDA');
let path = '';
path=rl.question('Write path of file json with your parameters for FDA: ');
let temp = FDA_EMUL();
try{
	temp.fromJSON(path);
}
catch(except){
	console.log(except);
}
let strFDA = '';
let mode = false;
strFDA = rl.question('Please, enter your string for checking: ')
mode = rl.question('Do you want to watch each step of checking? (y-yes, n-no)');
if(mode=='y'){
	mode=true;
}
else mode = false;
console.log('Result of checking: ',temp.run(strFDA,mode));