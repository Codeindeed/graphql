import { Address, ipfs, json } from "@graphprotocol/graph-ts";
import {
  DepositsPaidOut,
  NewEventCreated,
  NewRsvp,
  confirmedAttendee,
} from "../generated/Web3RSVP/Web3RSVP";
import { Event, Account, RSVP, Confirmation } from "../generated/schema";
import { address, bytes, integer } from "@protofire/subgraph-toolkit";

export function handleNewEventCreated(event: NewEventCreated): void {
  let newEvent = Event.load(event.params.eventId.toHex());
  if (newEvent === null) {
    newEvent = new Event(event.params.eventId.toHex());
    newEvent.eventID = event.params.eventId;
    newEvent.eventOwner = event.params.creatorAddress;
    newEvent.eventTimestamp = event.params.eventTimeStamp;
    newEvent.maxCapacity = event.params.maxCapacity;
    newEvent.deposit = event.params.deposit;
    newEvent.paidOut = false;
    newEvent.totalRsvps = integer.ZERO;
    newEvent.totalConfirmedAttendees = integer.ZERO;
    let metadata = ipfs.cat(event.params.eventDataCID + "/data.json");
    if (metadata) {
      const value = json.fromBytes(metadata).toObject();
      if (value) {
        const name = value.get("name");
        const description = value.get("description");
        const link = value.get("link");
        const imagePath = value.get("image");
        if (name) {
          newEvent.name = name.toString();
        }
        if (description) {
          newEvent.description = description.toString();
        }
        if (link) {
          newEvent.link = link.toString();
        }
        if (imagePath) {
          const imageUrl =
            "https://ipfs.io/" +
            event.params.eventDataCID +
            imagePath.toString();
          newEvent.imageURL = imageUrl;
        } else {
          const fallbackUrl =
            "https://ipfs.io/ipfs/bafybeibssbrlptcefbqfh4vpw2wlmqfj2kgxt3nil4yujxbmdznau3t5wi/event.png";
          newEvent.imageURL = fallbackUrl;
        }
      }
    }
    newEvent.save();
  }
}
function getOrCreateAccount(address: Address): Account {
  let account = Account.load(address.toHex());
  if (account === null) {
    account = new Account(address.toHex());
    account.totalRsvps = integer.ZERO;
    account.totalAttendedEvents = integer.ZERO;
    account.save();
  }
  return account;
}
export function handleNewRsvp(event: NewRsvp): void {
  let newRSVP = RSVP.load(event.transaction.from.toHex());
  let account = getOrCreateAccount(event.params.attendeeAddress);
  let thisEvent = Event.load(event.params.eventId.toHex());
  if ((newRSVP == null && thisEvent != null)) {
    newRSVP = new RSVP(event.transaction.from.toHex());
    newRSVP.attendee = account.id;
    newRSVP.event = thisEvent.id;
    newRSVP.save();
    account.totalRsvps = integer.increment(account.totalRsvps);
    account.save();
  }
}

export function handleconfirmedAttendee(event: confirmedAttendee): void {
  let id = event.params.eventId.toHex() + event.params.attendeeAddress.toHex();
  let newConfirmation = Confirmation.load(id);
  let account = getOrCreateAccount(event.params.attendeeAddress);
  let thisEvent = Event.load(event.params.eventId.toHex());
  if (newConfirmation === null && thisEvent != null) {
    newConfirmation = new Confirmation(id);
    newConfirmation.attendee = account.id;
    newConfirmation.event = thisEvent.id;
    newConfirmation.save();
    thisEvent.totalConfirmedAttendees = integer.increment(
      thisEvent.totalConfirmedAttendees
    );
    thisEvent.save();
    account.totalAttendedEvents = integer.increment(
      account.totalAttendedEvents
    );
    account.save();
  }
}

export function handleDepositsPaidOut(event: DepositsPaidOut): void {
  let thisEvent = Event.load(event.params.eventId.toHex());
  if (thisEvent) {
    thisEvent.paidOut = true;
    thisEvent.save();
  }
}


