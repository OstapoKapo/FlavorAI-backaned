import { Request, Response, NextFunction } from 'express';
import { NotFoundException } from '@nestjs/common';

type FindUniqueFn<T> = (id: string) => Promise<T | null>;

export interface RequestWithEntity<T> extends Request {
	entity?: T;
}

export function isExistMiddlewareFactory<T>(
	findUnique: FindUniqueFn<T>,
	resourceName: string,
) {
	return async function (
		req: RequestWithEntity<T>,
		res: Response,
		next: NextFunction,
	) {
		const { id } = req.params;
		console.log('Middleware triggered for ID:', id);
		if (!id) throw new NotFoundException('ID is required');

		const entity = await findUnique(id);
		if (!entity) {
			throw new NotFoundException(
				`Resource ${resourceName} with id ${id} not found`,
			);
		}

		req.entity = entity;
		next();
	};
}
