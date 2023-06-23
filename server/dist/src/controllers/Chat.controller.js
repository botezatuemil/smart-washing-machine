"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChat = exports.getUpdatedMessage = exports.getMessages = exports.getConversations = void 0;
const client_1 = require("@prisma/client");
const ConvertKeys_1 = require("../utils/ConvertKeys");
const prisma = new client_1.PrismaClient();
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = res.locals.user_id;
    try {
        let conversation = [];
        const foundUser1 = yield prisma.$queryRaw `select * from conversations where conversations.user1_id = ${user_id}`;
        if (foundUser1.length > 0) {
            conversation = yield prisma.$queryRaw `
      select conversations.id, conversations.user1_id, 
      student.first_name, student.last_name, dorm.dorm_number, dorm.dorm_floor from conversations
      inner join student on student.id  = conversations.user2_id
      inner join dorm on dorm.id = student.dorm_id
      where conversations.user1_id = ${user_id};
      `;
        }
        else {
            const foundUser2 = yield prisma.$queryRaw `select * from conversations where conversations.user2_id = ${user_id}`;
            if (foundUser2.length > 0) {
                conversation = yield prisma.$queryRaw `
        select conversations.id, conversations.user2_id, 
        student.first_name, student.last_name, dorm.dorm_number, dorm.dorm_floor from conversations
        inner join student on student.id  = conversations.user1_id
        inner join dorm on dorm.id = student.dorm_id
        where conversations.user2_id = ${user_id};
        `;
            }
        }
        res.send((0, ConvertKeys_1.convertKeysArray)(conversation));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getConversations = getConversations;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.body;
    try {
        const messages = yield prisma.$queryRaw `
          select messages.* from messages
          where messages.conversation_id = ${conversationId}
        `;
        res.send((0, ConvertKeys_1.convertKeysArray)(messages));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getMessages = getMessages;
const getUpdatedMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    try {
        const message = yield prisma.messages.create({
            data: {
                conversation_id: data.conversation_id,
                message: data.message,
                sender_id: data.sender_id,
                timestamp: data.timestamp
            }
        });
        console.log(message);
        return message;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUpdatedMessage = getUpdatedMessage;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = res.locals.user_id;
    const { receiverId } = req.body;
    const existingConversation = yield prisma.$queryRaw `
  select * from conversations 
  where conversations.user1_id = ${user_id} 
  and conversations.user2_id = ${receiverId} 
  or conversations.user2_id = ${user_id}
  and conversations.user1_id = ${receiverId}`;
    try {
        if (existingConversation.length === 0) {
            const createdChat = yield prisma.conversations.create({
                data: {
                    user1_id: user_id,
                    user2_id: receiverId
                }
            });
            res.send((0, ConvertKeys_1.convertKeys)(createdChat));
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.createChat = createChat;
//# sourceMappingURL=Chat.controller.js.map