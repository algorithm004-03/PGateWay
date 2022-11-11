const isnull ={
	nan:function(a){		
		let result =false;
		if(a === undefined) { result=true;   }    
		if(a == null ) {  result=true;  }    
		if (!a){result=true;}
		return result;
	},
	
	str:function(a){
		let result =false;
		function spaceTrim(val){
			return val.replace(/(^\s*)|(\s*$)/g, "");
		}

		// 检测为空方法
		function checkNull(val){
			
			if (spaceTrim(val) === ''){
				return true;
		    }
		   return false;
			}
		result =checkNull(a);
		
		return result;
		
	},
	
	obj:function(a){
		let result =false;
		let c=0;
		for (let i in a) {			
			c+=1;
		    i=i+0; //无任何作用，用于react报错消除
		}
		if (c<1){
			result =true;
		}
		return result;
	}
}

export {isnull}
