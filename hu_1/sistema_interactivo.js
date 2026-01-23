let name = prompt('Ingrese su nombre: ');
let age = Number(prompt('Ingrese su edad: '));

age = Number(age);

while (isNaN(age) || !Number.isInteger(age) || age <= 0 || age > 120 ){
    alert("Ingrese una edad válida (número entero)");
    age = Number(prompt('Ingrese su edad: '));
}

if (age < 18){
    alert(`Hola ${name}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`)
    
} else {
    alert(`Hola ${name}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`)
}





