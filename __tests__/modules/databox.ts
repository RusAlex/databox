import Plugin from '../../src/modules/databox';

const initContext = jest.fn().mockImplementation(() => ({
  context: { appState: { metrics: {} } }
}));

describe('databox', () => {
  test('throws error when no token defined', () => {
    const m = new Plugin();
    expect(process.env.DATABOX_TOKEN).toBeUndefined();
    const ctx = new initContext();
    expect(() => m.init(ctx)).toThrowError();
  });
});
