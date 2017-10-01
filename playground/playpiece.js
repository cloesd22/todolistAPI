
function dog(breed, location, friendly){

    this.breed = breed;
    this.location = location;
    this.friendly = friendly || false;


    this.bark = (outputInterface)=>{

        if(this.friendly){
            outputInterface("woofhepeeeee");
        }else{
            outputInterface("Grrrr");
        }
    }

}


var doggo = new dog("Husky","IcePlace",null);
var doggi = new dog("Chiwawa","China",true);
var doggy = new dog("Corgee","USA",true);
var doggu = new dog("GShep","Russia",null);

doglist = [];
doglist.push(doggo);
doglist.push(doggi);
doglist.push(doggy);
doglist.push(doggu);


function consoleTextOut(sound) {
    console.log(sound)
}


function dogWhistle(){
    // Makes all dogs bark Simultainously.
    doglist.forEach(function(element) {
        element.bark(consoleTextOut);
    }, this);
}

dogWhistle();