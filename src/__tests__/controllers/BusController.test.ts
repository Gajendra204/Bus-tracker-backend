import { Request, Response } from 'express';
import { BusController } from '../../controllers/BusController';
import { Bus } from '../../models/Bus';

jest.mock('../../models/Bus');

describe('BusController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
    responseObject = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBus', () => {
    it('should create a new bus and return 201 status', async () => {
      const mockBus = {
        busNumber: 'BUS123',
        capacity: 50,
        save: jest.fn().mockResolvedValue({
          busNumber: 'BUS123',
          capacity: 50,
          _id: 'someId',
        }),
      };

      (Bus as jest.Mocked<any>).mockImplementation(() => mockBus);

      mockRequest.body = {
        busNumber: 'BUS123',
        capacity: 50,
      };

      await BusController.createBus(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toEqual({
        success: true,
        data: expect.objectContaining({
          busNumber: 'BUS123',
          capacity: 50
        })
      });
      expect(mockBus.save).toHaveBeenCalled();
    });
  });

  describe('getAllBuses', () => {
    it('should return all buses', async () => {
      const mockBuses = [
        {
          busNumber: 'BUS123',
          capacity: 50,
          assignedDriver: { name: 'Driver', email: 'Driver@gmail.com' },
        },
        {
          busNumber: 'BUS456',
          capacity: 40,
          assignedDriver: null,
        },
      ];

      (Bus.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockBuses),
      });

      await BusController.getAllBuses(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        success: true,
        data: mockBuses
      });
      expect(Bus.find).toHaveBeenCalled();
    });
  });

  describe('assignDriverToBus', () => {
    it('should assign a driver to a bus and return updated bus', async () => {
      const updatedBus = {
        busNumber: 'BUS123',
        capacity: 50,
        assignedDriver: 'driverId123',
        _id: 'busId123',
      };

      (Bus.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedBus);

      mockRequest.body = {
        busId: 'busId123',
        driverId: 'driverId123',
      };

      await BusController.assignDriverToBus(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        success: true,
        data: updatedBus
      });
      expect(Bus.findByIdAndUpdate).toHaveBeenCalledWith(
        'busId123',
        { assignedDriver: 'driverId123' },
        { new: true }
      );
    });
  });
});