const PerformanceService = require('../services/performance.service');

class PerformanceController {
  async createPerformance(req, res) {
    try {
      const performance = await PerformanceService.createPerformance(req.body);
      res.status(201).json(performance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllPerformances(req, res) {
    try {
      const performances = await PerformanceService.getAllPerformances();
      res.status(200).json(performances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPerformanceById(req, res) {
    try {
      const performance = await PerformanceService.getPerformanceById(req.params.id);
      res.status(200).json(performance);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updatePerformance(req, res) {
    try {
      const performance = await PerformanceService.updatePerformance(req.params.id, req.body);
      res.status(200).json(performance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePerformance(req, res) {
    try {
      await PerformanceService.deletePerformance(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new PerformanceController(); 