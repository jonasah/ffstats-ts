import 'reflect-metadata';

import { Container } from 'typedi';

import { ProcessingApp } from './processingApp';

Container.get(ProcessingApp).run();
