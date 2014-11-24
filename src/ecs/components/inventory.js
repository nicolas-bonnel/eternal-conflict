/*
 * Stuff is clothes and weapons
 * Belt is for shortcut consummable
 * bag hold picked items
 */
var inventory = {
    name: 'inventory',
    init: function (bagSize, beltSize) {
        this.stuff = {};
		this.belt = Array.apply(null, Array(beltSize));
		this.bag = Array.apply(null, Array(bagSize));
    },
    /*
	 * Use an item in belt or bag
	 */
	use : function(container,index,target){
		this[container][index].use(target);
	},
	add : function(item){
		if(item.type == 'consummable'){
			var freeInBelt = this.belt.map(function(o,idx){
				return !o ? idx : -1;
			}).filter(function(o){
				return idx >= 0;
			});
			if(freeInBelt.length){
				this.belt[freeInBelt[0]] = item;
				return true;
			}
		}
		if(item.usage){
			if(!this.stuff[item.usage]){
				this.stuff[item.usage] = item;
				return true;
			}	
		}
	},
	fillRandom : function(level,power){
		
	}
};