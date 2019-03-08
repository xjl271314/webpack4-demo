import './index.scss'
class Animal {
    name(){
        return 'Animal'
    }

    say(){
        return `I'm ${this.name}`
    }
}

class Dog extends Animal{
    // 需要插件转化
    food = 'bone'
    name(){
        return 'Dog'
    }
}
console.log(new Dog() instanceof Animal)
alert(111111)

document.querySelector('.a').innerHTML = new Dog().food

