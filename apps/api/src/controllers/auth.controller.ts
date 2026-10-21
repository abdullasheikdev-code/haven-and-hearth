import { Request, Response } from 'express';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Branch } from '../models/Branch';
import { signToken } from '../utils/jwt';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { UserRoles } from '@haven/shared';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, organizationName } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 409);
    }

    let organizationId: any;
    let branchId: any;

    // If registering as a business owner, establish default organization & branch
    if (role === UserRoles.RESTAURANT_OWNER) {
      const orgName = organizationName || `${name}'s Hospitality Group`;
      const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
      const org = await Organization.create({
        name: orgName,
        slug,
        contactEmail: email,
        contactPhone: phone,
      });
      organizationId = org._id;

      const branch = await Branch.create({
        organizationId: org._id,
        name: 'Main Flagship',
        slug: 'flagship',
        phone: phone || '+1 (555) 019-2831',
        address: {
          street: '142 Grand Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10013',
          country: 'USA',
        },
      });
      branchId = branch._id;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || UserRoles.CUSTOMER,
      phone,
      organizationId,
      branchId,
    });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId?.toString(),
      branchId: user.branchId?.toString(),
      hotelId: user.hotelId?.toString(),
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          organizationId: user.organizationId,
          branchId: user.branchId,
        },
        token,
      },
      'Registration successful',
      201
    );
  } catch (err: any) {
    return sendError(res, err.message || 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'This account has been deactivated. Please contact support.', 403);
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId?.toString(),
      branchId: user.branchId?.toString(),
      hotelId: user.hotelId?.toString(),
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          organizationId: user.organizationId,
          branchId: user.branchId,
          hotelId: user.hotelId,
        },
        token,
      },
      'Login successful'
    );
  } catch (err: any) {
    return sendError(res, err.message || 'Login failed', 500);
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token');
  return sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Unauthenticated', 401);
  }

  const user = await User.findById(req.user.id).populate('organizationId branchId hotelId');
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  return sendSuccess(res, {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    organization: user.organizationId,
    branch: user.branchId,
    hotel: user.hotelId,
  });
};
