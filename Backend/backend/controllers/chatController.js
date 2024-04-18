const Chat = require("../models/chat");
const mongoose = require("mongoose");

const User = require("../models/User");

exports.getChats = async (req, res) => {
  const { senderId, receiverId, limit } = req.params;

  const chats = await Chat.find({
    // Recherche les messages de chat correspondant aux expéditeurs et destinataires spécifiés
    $or: [
      {
        sender: new mongoose.Types.ObjectId(senderId),
        receiver: new mongoose.Types.ObjectId(receiverId),
      },
      {
        sender: new mongoose.Types.ObjectId(receiverId),
        receiver: new mongoose.Types.ObjectId(senderId),
      },
    ],
  })
    .populate("sender")
    .populate("receiver")
    .sort({ createdAt: -1 }) // trié par date de création dans l'ordre décroissant
    .limit(limit);

  let receiver;

  const newChats = chats.reverse();

  res.json(newChats);
};


exports.createChat = async (req, res) => {
  const { sender, receiver, message } = req.body;
  let chat = null;

  let media;
  if (req.file && !!req.file.path) {
    // Message with image
    media = req.file.path;

    chat = new Chat({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      message: media,
    });
  } else {
    // Text message
    chat = new Chat({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      message,
    });
  }
  await chat.save();
  res.status(201).json(chat);
};

// find Chat for specific user
exports.userChats = async (req, res) => {
  try {
    const filteredChats = await Chat.aggregate([
      // Recherche des chats filtrés en fonction de l'ID de l'utilisateur
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(req.params.userId) },
            { receiver: mongoose.Types.ObjectId(req.params.userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: {
          path: "$sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: {
          path: "$receiver",
        },
      },

      {
        $group: {
          _id: {
            $cond: [
              {
                $gt: [{ $cmp: ["$sender", "$receiver"] }, 0], // Vérifie si l'ID du sender est supérieur à l'ID du receiver
              },
              { sender: "$sender", receiver: "$receiver" }, // Si oui, crée un objet avec le sender et le receiver
              { sender: "$receiver", receiver: "$sender" }, // Sinon, crée un objet avec le receiver et le sender
            ],
          },
          chat: { $last: "$$ROOT" }, // Stocke le dernier document de chaque groupe dans un champ appelé "chat"
        },
      },
      {
        $replaceRoot: { newRoot: "$chat" }, // Remplace le document racine par le document "chat"
      },
    ]);
    let result = [];
    //  Si une chaîne de recherche est fournie
    if (req.params.search && req.params.search.length > 0) {
      for (const res of filteredChats) {
        let receiver;
        // Déterminer l'utilisateur destinataire en fonction de l'ID de l'utilisateur actuel
        if (res.sender._id.toString() === req.params.userId) {
          receiver = res.receiver;
        } else if (res.receiver._id.toString() === req.params.userId) {
          receiver = res.sender;
        }

        let Rflname =
          receiver.fname.toLowerCase() + " " + receiver.lname.toLowerCase();
        let company = receiver.company;
        // Vérifier si le nom complet de l'utilisateur ou la société correspond à la chaîne de recherche
        if (
          (!company &&
            Rflname.toLowerCase().includes(
              req.params.search.toLocaleLowerCase()
            )) ||
          (company &&
            company
              .toLowerCase()
              .includes(req.params.search.toLocaleLowerCase()))
        ) {
          result.push(res);
        }
      }
    } else {
      // Si aucune chaîne de recherche n'est fournie, ajouter tous les chats filtrés à la liste des résultats
      result = filteredChats;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).send("chat not found");
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
