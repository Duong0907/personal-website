import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TURNSTILE_TEST_TOKEN, turnstileReset } from '../../../../../test/turnstile-mock';
import { sendContactMessage, type ContactState } from '../../actions';
import { ContactDialog } from '..';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('../../actions', () => ({ sendContactMessage: jest.fn() }));

const send = jest.mocked(sendContactMessage);
const values = { name: 'Ada', email: 'ada@example.com', message: 'Hello there' };

async function openAndFill() {
  await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
  await userEvent.type(await screen.findByLabelText('name'), values.name);
  await userEvent.type(screen.getByLabelText('email'), values.email);
  await userEvent.type(screen.getByLabelText('message'), values.message);
}

let finish: ((state: ContactState) => void) | undefined;

async function closeAndReopen() {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByLabelText('name')).not.toBeInTheDocument());
  await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
}

describe('ContactDialog', () => {
  beforeEach(() => {
    send.mockResolvedValue({ status: 'idle' });
  });

  afterEach(async () => {
    // An action left pending would leak into later tests through React's global transition queue.
    await act(async () => finish?.({ status: 'idle' }));
    finish = undefined;
  });

  it('renders the trigger and keeps the form out of the document until clicked', () => {
    render(<ContactDialog />);

    expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument();
    expect(screen.queryByLabelText('name')).not.toBeInTheDocument();
  });

  it('opens with three labelled fields', async () => {
    render(<ContactDialog />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));

    expect(await screen.findByLabelText('name')).toBeRequired();
    expect(screen.getByLabelText('email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('message')).toBeRequired();
  });

  it('renders a honeypot that is hidden from the accessibility tree', async () => {
    render(<ContactDialog />);
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await screen.findByLabelText('name');

    const honeypot = document.querySelector('input[name="ref_code"]');
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('textbox', { name: 'ref_code' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
  });

  it('submits all field values plus the turnstile token', async () => {
    render(<ContactDialog />);
    await openAndFill();

    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    const data = send.mock.calls[0][1];
    expect(data.get('name')).toBe(values.name);
    expect(data.get('email')).toBe(values.email);
    expect(data.get('message')).toBe(values.message);
    expect(data.get('ref_code')).toBe('');
    expect(data.get('cf-turnstile-response')).toBe(TURNSTILE_TEST_TOKEN);
  });

  it('disables submit and shows a spinner while pending', async () => {
    send.mockReturnValue(new Promise<ContactState>((resolve) => (finish = resolve)));
    render(<ContactDialog />);
    await openAndFill();

    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/ })).toBeDisabled();
  });

  it('shows an inline error and keeps the form filled', async () => {
    // Echo a distinct value so the assertion proves the defaultValue refill, not the user's own typing.
    send.mockResolvedValue({ status: 'error', values: { ...values, name: 'Echoed' } });
    render(<ContactDialog />);
    await openAndFill();

    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('error');
    expect(screen.getByLabelText('name')).toHaveValue('Echoed');
    expect(screen.getByLabelText('email')).toHaveValue(values.email);
    expect(screen.getByLabelText('message')).toHaveValue(values.message);
  });

  it('resets the Turnstile widget after a failed submission', async () => {
    send.mockResolvedValue({ status: 'error', values });
    render(<ContactDialog />);
    await openAndFill();
    expect(turnstileReset).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'submit' }));
    await screen.findByRole('alert');

    expect(turnstileReset).toHaveBeenCalledTimes(1);
  });

  it('does not reset the Turnstile widget after a success', async () => {
    send.mockResolvedValue({ status: 'success' });
    render(<ContactDialog />);
    await openAndFill();

    await userEvent.click(screen.getByRole('button', { name: 'submit' }));
    await screen.findByRole('status');

    expect(turnstileReset).not.toHaveBeenCalled();
  });

  it('shows the confirmation and hides the form on success', async () => {
    send.mockResolvedValue({ status: 'success' });
    render(<ContactDialog />);
    await openAndFill();

    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(await screen.findByRole('status')).toHaveTextContent('success');
    expect(screen.queryByLabelText('name')).not.toBeInTheDocument();
  });

  it('shows an empty form again when reopened after a success', async () => {
    send.mockResolvedValue({ status: 'success' });
    render(<ContactDialog />);
    await openAndFill();
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));
    await screen.findByRole('status');

    await closeAndReopen();

    expect(await screen.findByLabelText('name')).toHaveValue('');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('clears a stale error when reopened after a failure', async () => {
    send.mockResolvedValue({ status: 'error', values });
    render(<ContactDialog />);
    await openAndFill();
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));
    await screen.findByRole('alert');

    await closeAndReopen();

    expect(await screen.findByLabelText('name')).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
