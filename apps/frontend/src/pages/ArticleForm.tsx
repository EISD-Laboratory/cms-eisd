import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/reui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBack } from '@/lib/useBack'
import {
  ArticleSubmitError,
  createArticle,
  submitErrorCopy,
  validateArticleUrl,
  type AdminArticle,
} from '@/lib/articles'

const inputCls = 'w-full'
const errCls = 'mt-1 text-xs text-destructive'

export function ArticleForm() {
  const navigate = useNavigate()
  // Leaving the form returns to wherever the user came from (e.g. the
  // dashboard) instead of always the articles list.
  const back = useBack('/articles')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<ArticleSubmitError | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<AdminArticle | null>(null)

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const problem = validateArticleUrl(url)
    setError(problem)
    setSubmitError(null)
    if (problem) return
    setSubmitting(true)
    try {
      const entry = await createArticle(url)
      setCreated(entry)
      toast.success('Article saved as Draft.')
    } catch (err) {
      setCreated(null)
      setSubmitError(
        err instanceof ArticleSubmitError
          ? err
          : new ArticleSubmitError('server', err instanceof Error ? err.message : 'Unknown error'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setUrl('')
    setError(null)
    setSubmitError(null)
    setCreated(null)
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={back} title="Back">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">New article</h1>
            <p className="text-sm text-muted-foreground">
              Paste the Medium URL — title, description, and cover image are fetched automatically.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => void onSubmit(e)}
          noValidate
          className="flex flex-col gap-5 rounded-xl border border-[#E6EAF2] bg-[#F7F9FF] p-1"
        >
          <div className="flex flex-col gap-5 rounded-lg border border-[#EBEBEB] bg-white p-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="art-url">
                Medium URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="art-url"
                className={inputCls}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError(null)
                  if (submitError) setSubmitError(null)
                  if (created) setCreated(null)
                }}
                placeholder="https://medium.com/@eisd/your-article-abc123"
                inputMode="url"
                aria-invalid={!!error}
              />
              {!error && (
                <p className="text-xs text-muted-foreground">
                  Saved as a Draft — publish it from the list once ready.
                </p>
              )}
              {error && (
                <p className={errCls} role="alert">
                  {error}
                </p>
              )}
            </div>

            {submitError &&
              (() => {
                const copy = submitErrorCopy(submitError.kind)
                return (
                  <Alert>
                    <AlertTitle>{copy.title}</AlertTitle>
                    <AlertDescription>
                      <span className="mb-1 block break-all">{submitError.message}</span>
                      <span className="block text-xs">{copy.hint}</span>
                    </AlertDescription>
                  </Alert>
                )
              })()}

            {created && (
              <Alert>
                <AlertTitle>Saved as Draft</AlertTitle>
                <AlertDescription>
                  <span className="mb-3 block break-all">
                    “{created.title}” ({created.url})
                  </span>
                  <span className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => void navigate('/articles')}>
                      Back to articles
                    </Button>
                    <Button variant="outline" size="sm" type="button" onClick={reset}>
                      Add another
                    </Button>
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" type="button" onClick={back}>
                Cancel
              </Button>
              <Button type="submit" className="text-white" disabled={submitting}>
                {submitting ? 'Saving…' : 'Fetch & save as Draft'}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}
