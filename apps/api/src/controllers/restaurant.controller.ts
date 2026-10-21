import { Request, Response } from 'express';
import { Restaurant } from '../models/Restaurant';
import { MenuItem } from '../models/MenuItem';
import { Table } from '../models/Table';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const { cuisine, priceRange, search } = req.query;
    const filter: any = { isActive: true };

    if (cuisine) {
      filter.cuisine = { $in: [cuisine] };
    }
    if (priceRange) {
      filter.priceRange = priceRange;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
      ];
    }

    const restaurants = await Restaurant.find(filter).sort({ rating: -1 });
    return sendSuccess(res, restaurants);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getRestaurantBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const restaurant = await Restaurant.findOne({ slug, isActive: true }).populate('branchId');
    if (!restaurant) {
      return sendError(res, 'Restaurant not found', 404);
    }

    const menuItems = await MenuItem.find({ restaurantId: restaurant._id, isAvailable: true });
    const tables = await Table.find({ branchId: restaurant.branchId }).select('tableNumber capacity status floorZone');

    return sendSuccess(res, {
      restaurant,
      menuItems,
      tables,
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const { restaurantId, category } = req.query;
    const filter: any = { isAvailable: true };
    if (restaurantId) filter.restaurantId = restaurantId;
    if (category) filter.category = category;

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    return sendSuccess(res, items);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const item = await MenuItem.create(req.body);
    return sendSuccess(res, item, 'Menu item created successfully', 201);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) return sendError(res, 'Item not found', 404);
    return sendSuccess(res, item, 'Menu item updated');
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};
