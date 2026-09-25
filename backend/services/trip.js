import Trip from '../models/trip.js';
import { NotFoundError } from '../errors/notfound.js';
import { ConflictError } from '../errors/conflict.js';
import { generateAccessToken, verifyAccessToken } from '../config/jwt.js';
import sendMail from '../utils/send-mail.js';

export const create = async (data) => {
    const trip = await Trip.create(data);
    return trip;
}

    export const index = async (userId) => {
        const trips = await Trip.find({ user: userId });
        return trips;
    }

    export const find = async (id, userId) => {
        const trip = await Trip
        .findOne({_id: id, user: userId})
        .populate("collaborators", "email")
        .populate("user", "name");

        if (!trip) throw new NotFoundError('Trip not found');
        return trip;
    }

    export const update = async (id, data, userId) => {
        const trip = await Trip.findByIdAndUpdate(
            {_id: id, user: userId}, data, { new: true }
        );
        if (!trip) throw new NotFoundError('Trip not found');
        return trip;
    }

    export const remove = async (id, userId) => {
    const trip = await Trip.findOneAndDelete({ _id: id, user: userId });
    if (!trip) throw new NotFoundError('Trip not found');
    return trip;
}
export const invite = async (id, userId, collaboratorEmails) => {
    const trip = await find(id, userId);

    console.log("INVITE EMAILS:", collaboratorEmails);
    console.log("TRIP FOUND:", trip.title);

    if (
        trip.collaborators?.some((collaborator) =>
            collaboratorEmails.includes(collaborator.email)
        )
    ) {
        throw new ConflictError("Collaborator already invited");
    }

    const token = await generateAccessToken({ tripId: id }, "1h");

    const invitationLink =
        `${process.env.FRONTEND_URL}/trips/${id}/invite/accept?token=${token}`;

    console.log("INVITATION LINK:", invitationLink);

    console.log("ABOUT TO SEND EMAIL...");

    await sendMail(
        collaboratorEmails.join(","),
        "Invitation to join a trip",
        {
            link: invitationLink,
            title: trip.title,
            startDate: trip.startDate.toDateString(),
            endDate: trip.endDate.toDateString(),
            name: trip.user.name,
        }
    );

    console.log("SEND MAIL FUNCTION FINISHED");

    return {
        message: "Collaborators invited successfully"
    };
};

export const accept = async (token, userId) => {
    const tripId = verifyAccessToken(token);
    const trip = await Trip.findOne({ _id: tripId }).populate(
        "collaborators"
    );

    if (!trip) throw new NotFoundError("Trip not found");
    if (
        trip.collaborators.some(
            (collaborator) => collaborator._id.toString() === userId.toString()
        )
    ) {
        throw new ConflictError("User already a collaborator");
    }

    trip.collaborators.push(userId);
    await trip.save();

    return { message: "Invitation accepted successfully"};
}