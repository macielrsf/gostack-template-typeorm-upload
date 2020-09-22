import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import FindOrCreateCategoryService from './FindOrCreateCategoryService';

const findOrCreateCategory = new FindOrCreateCategoryService();

interface Request {
    title: string;
    value: number;
    type: 'income' | 'outcome';
    category: string;
}

class CreateTransactionService {
    public async execute({
        title,
        value,
        type,
        category,
    }: Request): Promise<Transaction> {
        const transactionsRepository = getCustomRepository(
            TransactionsRepository,
        );

        const { total } = await transactionsRepository.getBalance();

        if (type === 'outcome' && total < value) {
            throw new AppError('You do not have enough balance.');
        }

        const { id: category_id } = await findOrCreateCategory.execute({
            title: category,
        });

        const transaction = transactionsRepository.create({
            title,
            value,
            type,
            category_id,
        });

        await transactionsRepository.save(transaction);

        return transaction;
    }
}

export default CreateTransactionService;
