import Notification from "../../models/Notification.js";
import { getSocketIO } from "../../socket/socketInstance.js";

export const createNotification = async ({
  recipient,
  sender,
  type,
  post = null,
  comment = null,
  tag = null,
  message,
}) => {
  if (recipient && sender && recipient.toString() === sender.toString()) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    post,
    comment,
    tag,
    message,
  });

  const populatedNotification = await Notification.findById(notification._id)
    .populate("sender", "name username avatarUrl")
    .populate("post", "title slug")
    .populate("comment", "content")
    .populate("tag", "name slug");

  const io = getSocketIO();

  io.to(`user:${recipient}`).emit("notification:new", populatedNotification);

  return populatedNotification;
};
