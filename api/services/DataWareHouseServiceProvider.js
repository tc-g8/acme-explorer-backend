"use strict";
import * as PromiseDataWarehouseService from "./PromiseDataWareHouseService.js";

const initializeDataWarehouseJob = () => {
  return PromiseDataWarehouseService.initializeDataWarehouseJob();
};

const restartDataWarehouseJob = (period) => {
  return PromiseDataWarehouseService.restartDataWarehouseJob(period);
};

const amountSpentByExplorer = async (params) => {
  return await PromiseDataWarehouseService.amountSpentByExplorer(params);
};

const explorersByAmountSpent = async (params) => {
  return await PromiseDataWarehouseService.explorersByAmountSpent(params);
};

export {
  initializeDataWarehouseJob,
  restartDataWarehouseJob,
  amountSpentByExplorer,
  explorersByAmountSpent
};
