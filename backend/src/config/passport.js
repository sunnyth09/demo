import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/sequelize/index.js';

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Tìm user theo google_id
      let user = await User.findOne({ where: { google_id: profile.id } });

      if (user) {
        return done(null, user);
      }

      // 2. Nếu không có google_id -> Tìm theo email
      if (profile.emails && profile.emails.length > 0) {
        const email = profile.emails[0].value;
        user = await User.findOne({ where: { email } });

        if (user) {
          // Link google_id vào user cũ
          user.google_id = profile.id;
          if (!user.avatar && profile.photos && profile.photos.length > 0) {
              user.avatar = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }
      }

      // 3. Nếu chưa có user -> Tạo mới
      const newUser = await User.create({
        google_id: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        password: null, // Không có password
        role: 'user'
      });

      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'],
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Tìm user theo facebook_id
      let user = await User.findOne({ where: { facebook_id: profile.id } });

      if (user) {
        return done(null, user);
      }

      // 2. Nếu không có facebook_id -> Tìm theo email
      if (profile.emails && profile.emails.length > 0) {
        const email = profile.emails[0].value;
        user = await User.findOne({ where: { email } });

        if (user) {
          // Link facebook_id vào user cũ
          user.facebook_id = profile.id;
          if (!user.avatar && profile.photos && profile.photos.length > 0) {
              user.avatar = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }
      }

      // 3. Nếu chưa có user -> Tạo mới
      const newUser = await User.create({
        facebook_id: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        password: null, // Không có password
        role: 'user'
      });

      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }
));
