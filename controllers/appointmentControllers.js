const Appointment = require('../models/appointment');
const User = require('../models/user');
const Service = require('../models/service');

const express = require('express');
const mongoose = require('mongoose');


const appointmentController = {
  createAppointment: async (request, response) => {
    try {
      const { date, time, userId, serviceId } = request.body;
      console.log('Received appointment data:', request.body);

      if (!date || !time || !userId || !serviceId) {
        return response.status(400).json({ message: 'All fields are required' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return response.status(404).json({ message: 'User not found' });
      }

      const service = await Service.findById(serviceId);
      if (!service) {
        return response.status(404).json({ message: 'Service not found' });
      }

      const newAppointment = new Appointment({ date, time, userId, serviceId });
      await newAppointment.save();

      response.status(201).json({ message: 'Appointment booked', data: newAppointment });
    } catch (error) {
      console.error('Error creating appointment:', error);
      response.status(500).json({ success: false, error: error.message });
    }
  },

  getAllAppointments: async (request, response) => {
    try {
      // Find appointments from the database
      const appointments = await Appointment.find()
        .populate('userId', 'name email')
        .populate('serviceId', 'name description price');

      // Send as the response
      response.status(200).json({ success: true, data: appointments });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      response.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = appointmentController;
