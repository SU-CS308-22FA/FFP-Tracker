const Player = require("../models/Player");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");




//get all players
const getAllPlayers = asyncHandler(async (req, res) => {
    const players = await Player.find().lean();
    res.json(players);
    });



//get player by id
const getPlayerById = asyncHandler(async (req, res) => {
    const { id } = req.params.id;
    const player = await Player.findOne
    ({ _id: id }).lean();
    if (!player)
        return res.status(404).json({ error: "Player not found!" });
    return res.status(200).json(player);
    });


// create a new player with a name, team, position, number, wage, nationality, and birthdate
const createPlayer = asyncHandler(async (req, res) => {

    const { name, team, position, number, wage, nationality, birthDate } = req.body;
    if (!name || !team || !position || !number || !wage || !nationality || !birthDate) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const player = await Player.create({
            name: name,
            team: team,
            position: position,
            number: number,
            wage: wage,
            nationality: nationality,
            birthDate: birthDate
        });
        return res.status(201).json(player);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error!" });
    }
    });




// update a player by player id
const updatePlayerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, team, position, number, wage, nationality } = req.body;
    if (!name || !team || !position || !number || !wage || !nationality || !birthDate) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    const player = await Player.findOne
    ({ _id: id });
    if (!player)
        return res.status(404).json({ error: "Player not found!" });
    player.name.set(name);
    player.team.set(team);
    player.position.set(position);
    player.number.set(number);
    player.wage.set(wage);
    player.nationality.set(nationality);
    const result = await player.save();
    return res.status(200).json(player);
    });



// delete a player by player id
const deletePlayerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findOne
    ({ _id: id });
    if (!player)
        return res.status(404).json({ error: "Player not found!" });
    const result = await Player.deleteOne
    ({ _id: id });
    return res.status(200).json({ message: "Player deleted!" });
    });


module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayerById,
    deletePlayerById
};
