import 'reflect-metadata';

import { Container } from 'typedi';

import { ProcessingApp } from './processing-app';

Container.get(ProcessingApp).run();
