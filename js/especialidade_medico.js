const especialidadeMedicos = {

    "Clínico Geral": {
        "Dr. Ricardo Almeida": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Fernanda Lopes": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
        "Dr. Gustavo Martins": ["14:00","15:00","16:00","19:00","20:00"]
    },

    "Cardiologista": {
        "Dr. Lucas Neiva": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Camila Duarte": ["14:00","15:00","16:00","19:00","20:00"],
        "Dr. Rafael Torres": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
    },

    "Dermatologista": {
        "Dra. Marcela Ribeiro": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
        "Dr. Paulo Nogueira": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Bianca Farias": ["14:00","15:00","16:00","19:00","20:00"],
    },

    "Ginecologista": {
        "Dra. Juliana Carvalho": ["14:00","15:00","16:00","19:00","20:00"],
        "Dr. Carlos Mendes": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Patrícia Rocha": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
    },

    "Oftalmologista": {
        "Dr. André Pacheco": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Lívia Barros": ["14:00","15:00","16:00","19:00","20:00"],
        "Dr. Felipe Cardoso": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
    },

    "Pediatra": {
        "Dra. Renata Oliveira": ["14:00","15:00","16:00","19:00","20:00"],
        "Dr. Marcelo Batista": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Aline Freitas": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
    },

    "Ortopedista": {
        "Dr. Bruno Teixeira":["07:00", "08:00", "09:00", "11:30"],
        "Dr. Eduardo Lopes": ["14:00","15:00","16:00","19:00","20:00"],
        "Dra. Mariana Campos": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
    },

    "Neurologista": {
        "Dr. Fernando Azevedo": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
        "Dra. Carla Menezes": ["14:00","15:00","16:00","19:00","20:00"],
        "Dr. Diego Santana": ["07:00", "08:00", "09:00", "11:30"],
    },

    "Endocrinologista": {
        "Dra. Priscila Andrade": ["14:00","15:00","16:00","19:00","20:00"],
        "Dr. Renato Moraes": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Juliana Prado": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
    },

    "Psiquiatra": {
        "Dr. Rodrigo Farias": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Beatriz Antunes": ["14:00","15:00","16:00","19:00","20:00"],
        "Dr. Henrique Valente": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
    },

    "Dentista": {
        "Dra. Tatiane Costa": ["08:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
        "Dr. Eduardo Lima": ["07:00", "08:00", "09:00", "11:30"],
        "Dra. Camila Pires": ["14:00","15:00","16:00","19:00","20:00"]
    },

};


const selectEspecialidade = document.getElementById("especialidade");
const selectMedico = document.getElementById("medico");
const selectHorario = document.getElementById("horario");
const dataConsulta = document.getElementById("dataConsulta");


// carregar médicos
selectEspecialidade.addEventListener("change", function(){

const especialidade = this.value;

selectMedico.innerHTML = '<option disabled selected>Selecione um médico</option>';

const medicos = Object.keys(especialidadeMedicos[especialidade]);

medicos.forEach(function(medico){

const option = document.createElement("option");
option.value = medico;
option.textContent = medico;

selectMedico.appendChild(option);

});

});


// carregar horários
selectMedico.addEventListener("change", function(){

const especialidade = selectEspecialidade.value;
const medico = this.value;

const horarios = especialidadeMedicos[especialidade][medico];

selectHorario.innerHTML = '<option disabled selected>Selecione um horário</option>';

horarios.forEach(function(hora){

const option = document.createElement("option");
option.value = hora;
option.textContent = hora;

selectHorario.appendChild(option);

});

});

