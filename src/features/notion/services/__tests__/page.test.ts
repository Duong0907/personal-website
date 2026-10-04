import { notionApi } from '../notion';
import { getNotionPage } from '../page';

jest.mock('../notion', () => ({ notionApi: { getPage: jest.fn() } }));
jest.mock('next/cache', () => ({ unstable_cache: jest.fn() }));

const getPage = jest.mocked(notionApi.getPage);

describe('getNotionPage', () => {
  it('returns the record map for the block id', async () => {
    const recordMap = { block: { abc: {} } };
    getPage.mockResolvedValue(recordMap as never);

    await expect(getNotionPage('abc')).resolves.toBe(recordMap);
    expect(getPage).toHaveBeenCalledWith('abc');
  });

  it('returns null and logs when Notion fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    getPage.mockRejectedValue(new Error('not found'));

    await expect(getNotionPage('missing')).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalled();
  });
});
