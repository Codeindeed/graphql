import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  DepositsPaidOut,
  NewEventCreated,
  NewRsvp,
  confirmedAttendee
} from "../generated/Web3RSVP/Web3RSVP"

export function createDepositsPaidOutEvent(eventId: Bytes): DepositsPaidOut {
  let depositsPaidOutEvent = changetype<DepositsPaidOut>(newMockEvent())

  depositsPaidOutEvent.parameters = new Array()

  depositsPaidOutEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )

  return depositsPaidOutEvent
}

export function createNewEventCreatedEvent(
  eventId: Bytes,
  creatorAddress: Address,
  eventTimeStamp: BigInt,
  maxCapacity: BigInt,
  deposit: BigInt,
  eventDataCID: string
): NewEventCreated {
  let newEventCreatedEvent = changetype<NewEventCreated>(newMockEvent())

  newEventCreatedEvent.parameters = new Array()

  newEventCreatedEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )
  newEventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "creatorAddress",
      ethereum.Value.fromAddress(creatorAddress)
    )
  )
  newEventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "eventTimeStamp",
      ethereum.Value.fromUnsignedBigInt(eventTimeStamp)
    )
  )
  newEventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxCapacity",
      ethereum.Value.fromUnsignedBigInt(maxCapacity)
    )
  )
  newEventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "deposit",
      ethereum.Value.fromUnsignedBigInt(deposit)
    )
  )
  newEventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "eventDataCID",
      ethereum.Value.fromString(eventDataCID)
    )
  )

  return newEventCreatedEvent
}

export function createNewRsvpEvent(
  eventId: Bytes,
  attendeeAddress: Address
): NewRsvp {
  let newRsvpEvent = changetype<NewRsvp>(newMockEvent())

  newRsvpEvent.parameters = new Array()

  newRsvpEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )
  newRsvpEvent.parameters.push(
    new ethereum.EventParam(
      "attendeeAddress",
      ethereum.Value.fromAddress(attendeeAddress)
    )
  )

  return newRsvpEvent
}

export function createconfirmedAttendeeEvent(
  eventId: Bytes,
  attendeeAddress: Address
): confirmedAttendee {
  let confirmedAttendeeEvent = changetype<confirmedAttendee>(newMockEvent())

  confirmedAttendeeEvent.parameters = new Array()

  confirmedAttendeeEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )
  confirmedAttendeeEvent.parameters.push(
    new ethereum.EventParam(
      "attendeeAddress",
      ethereum.Value.fromAddress(attendeeAddress)
    )
  )

  return confirmedAttendeeEvent
}
