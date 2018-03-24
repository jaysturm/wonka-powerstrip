#!/usr/bin/python
import RPi.GPIO as GPIO
import time, datetime as dt, sched

GPIO.setmode(GPIO.BCM)

turnOn = GPIO.LOW
turnOff = GPIO.HIGH

# app settings

pulsesPerGallon = 60

pType1 = "Moby Dick"

waterPulseAmount = 60 # desired pulse amount
dispensed = 0 # how much water has been dispensed so far
delayInterval = 10 # hours between cycle

# pin variables

r1Pin = 2
r2Pin = 3
r3Pin = 4
r4Pin = 17

flowSensor1Pin = 27

# init list with pin numbers

pinList = [r1Pin, r2Pin, r3Pin ,r4Pin]

# loop through pins and set mode and state to 'low'

for i in pinList:
    GPIO.setup(i, GPIO.OUT)
    GPIO.output(i, turnOff)

# water flow sensor pin event handler

def pulse_handler(channel):
  print("Channel => " + channel)
  dispensed += 1

GPIO.setup(flowSensor1Pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(flowSensor1Pin, GPIO.RISING, callback=pulse_handler, bouncetime=300)

# function which defines and schedules a fresh watering cycle

def start_fresh_water(scheduler, plantType):
  print("\nOpening fresh water valve for " + plantType +" plant(s) " + dt.datetime.now().strftime("%B %d, %Y %I:%M%p"))

  dispensed = 0
  GPIO.output(r1Pin, turnOn)

  # uncomment below and remove delay once sensor is installed
  #while dispensed < waterPulseAmount:
  #  print "watering..."

  time.sleep(5)

  dispensed = 0
  print(str(waterPulseAmount / pulsesPerGallon) + " gallon(s) of water dispensed")
  print("Closing fresh water valve for " + plantType + " plant(s) " + dt.datetime.now().strftime("%B %d, %Y %I:%M%p"))

  GPIO.output(r1Pin, turnOff)

  scheduler.enter(delayInterval, 1, start_fresh_water, (scheduler, pType1))

# main loop

try:
  print("\n>>>> Starting watering system <<<<")

  sch = sched.scheduler(time.time, time.sleep)

  start_fresh_water(sch, pType1)

  sch.run()

  GPIO.cleanup()

# End program cleanly with keyboard
except KeyboardInterrupt:
  print("\n>>>> Stopping watering system <<<<\n")

  # Reset GPIO settings
  GPIO.cleanup()
