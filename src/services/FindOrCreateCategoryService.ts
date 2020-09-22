import { getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
    title: string;
}

class FindOrCreateCategoryService {
    public async execute({ title }: Request): Promise<Category> {
        const categoriesRepository = getCustomRepository(CategoriesRepository);

        const findCategory = await categoriesRepository.getCategory(title);

        if (findCategory) {
            return findCategory;
        }

        const category = categoriesRepository.create({
            title,
        });

        await categoriesRepository.save(category);

        return category;
    }
}

export default FindOrCreateCategoryService;
