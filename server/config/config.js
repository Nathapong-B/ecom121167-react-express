const { PrismaClient } = require('@prisma/client');

exports.prisma = new PrismaClient();

exports.bcrypt = require('bcryptjs');

exports.jwt = require('jsonwebtoken');

exports.multer = require('multer');

exports.cloudinary = require('cloudinary').v2;

exports.stripe = require("stripe")(process.env.STRIPE_PAYMENT_KEY);
