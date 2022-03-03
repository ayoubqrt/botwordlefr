# Bot Discord WordleFR

## Description

Ce bot permet de récupérer les résultats des personnes qui participent tous les jours au jeu « [Le mot](https://wordle.louan.me/) » et de faire un récapitulatif de la journée en envoyant un message dans un channel dédié.

## Pré-requis 

Il faut un channel dédié seulement au jeu où les joueurs publieront leurs résultats grâce à la fonction "Partager" implémenté directement dans le jeu.

# Installation

1. Créer un ficher .env avec une variable "token" qui aura pour valeur le token de votre bot discord
2. npm install 
3. npm start

## Notes

Le programme est éxécuté directement lors du npm start. Pour ma part, le bot à été host sur l'hébergeur [Heroku](https://wordle.louan.me/) qui propose un add-on [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler) permettant de lancer une tâche à un instant T. 
Mais il est tout à fait possible d'implémenter un Cron dans le code. J'ai préféré utiliser Heroku Scheduler car les applications hébergées sur Heroku se mettent en veille automatiquement.
